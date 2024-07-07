document.addEventListener("DOMContentLoaded", function () {
  const gpaInput1 = document.getElementById("gpaInput1");
  const gpaInput2 = document.getElementById("gpaInput2");

  gpaInput1.addEventListener("input", function () {
    if (gpaInput1.value.length > 4) {
      gpaInput1.value = gpaInput1.value.slice(0, 4);
    }
  });

  gpaInput2.addEventListener("input", function () {
    if (gpaInput2.value.length > 3) {
      gpaInput2.value = gpaInput2.value.slice(0, 3);
    }
  });
});

document.getElementById("photo").addEventListener("change", function (event) {
  const input = event.target;
  const fileName =
    input.files.length > 0 ? input.files[0].name : "No file selected";
  document.getElementById("fileName").textContent = fileName;
});

document
  .getElementById("timpaForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const universitas = document.getElementById("universitas").value.trim();
    const jurusan = document.getElementById("jurusan").value.trim();
    const gpaInput1 = document.getElementById("gpaInput1").value.trim();
    const gpaInput2 = document.getElementById("gpaInput2").value.trim();
    const medal1 = document.getElementById("medal1").value.trim();
    const descMedal1 = document.getElementById("descMedal1").value.trim();
    const medal2 = document.getElementById("medal2").value.trim();
    const descMedal2 = document.getElementById("descMedal2").value.trim();
    const photoFile = document.getElementById("photo").files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
      const photoData = event.target.result;

      const fontMoby = new FontFace("Moby", "url(./fonts/moby-reg.ttf)");
      const fontGaboedThin = new FontFace(
        "Gaboed Thin",
        "url(./fonts/gaboed-thin.ttf)"
      );
      const fontGaboedBold = new FontFace(
        "Gaboed Bold",
        "url(./fonts/gaboed-bold.ttf)"
      );

      Promise.all([
        fontMoby.load(),
        fontGaboedThin.load(),
        fontGaboedBold.load(),
      ])
        .then((loadedFonts) => {
          loadedFonts.forEach((font) => document.fonts.add(font));
          createImage(
            nama,
            universitas,
            jurusan,
            gpaInput1,
            gpaInput2,
            medal1,
            descMedal1,
            medal2,
            descMedal2,
            photoData
          );
        })
        .catch((error) => {
          console.error("Failed to load fonts:", error);
        });
    };

    if (photoFile) {
      reader.readAsDataURL(photoFile);
    } else {
      console.log(
        nama,
        universitas,
        jurusan,
        gpaInput1,
        gpaInput2,
        medal1,
        descMedal1,
        medal2,
        descMedal2,
        null
      );
    }
  });

async function createImage(
  nama,
  universitas,
  jurusan,
  gpaInput1,
  gpaInput2,
  medalA,
  descA,
  medalB,
  descB,
  photoData
) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const outputImg = document.getElementById("generatedImage");
  const downloadButton = document.getElementById("downloadButton");

  // Template
  const img = new Image();
  img.src = "./images/template.webp";
  await img.decode();

  ctx.drawImage(img, 0, 0, 1024, 1080);

  // Overlay
  const centerImage = new Image();
  centerImage.src = photoData;
  await centerImage.decode();

  const desiredWidth = 500;
  const desiredHeight = 600;

  const scaleX = desiredWidth / centerImage.width;
  const scaleY = desiredHeight / centerImage.height;
  const scale = Math.min(scaleX, scaleY);

  const newWidth = centerImage.width * scale;
  const newHeight = centerImage.height * scale;

  const centerX = (canvas.width - newWidth) / 2;
  const centerY = (canvas.height - newHeight) / 2;

  ctx.drawImage(centerImage, centerX, centerY, newWidth, newHeight);

  // Namanya
  ctx.fillStyle = "#f5ca02";
  let fontSize = 80;
  if (nama.length > 6) {
    fontSize = Math.max(40, 80 - (nama.length - 6) * 5);
  }

  ctx.font = `${fontSize}px 'Moby', sans-serif`;
  ctx.textAlign = "center";

  const x = 100;
  const lineHeight = fontSize + 15;
  const yStart = 500 - ((nama.length - 1) * lineHeight) / 2;

  for (let i = 0; i < nama.length; i++) {
    ctx.fillText(nama[i], x, yStart + i * lineHeight);
  }

  // Univ
  const univFont = "'Gaboed Bold', sans-serif";
  const maxWidthUniv = 200;
  let univSize = 55;

  function getTextWidth(universitas, univSize, univFont) {
    ctx.font = `${univSize}px ${univFont}`;
    return ctx.measureText(universitas).width;
  }

  while (getTextWidth(universitas, univSize, univFont) > maxWidthUniv) {
    univSize -= 1;
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = `${univSize}px ${univFont}`;
  ctx.textAlign = "center";
  ctx.fillText(universitas, 155, 915);

  // Jurusan
  const jurusanFont = "'Gaboed Thin', sans-serif";
  const maxWidthJurusan = 350;
  let jurusanSize = 40;

  function getTextWidth(jurusan, jurusanSize, jurusanFont) {
    ctx.font = `${jurusanSize}px ${jurusanFont}`;
    return ctx.measureText(jurusan).width;
  }

  while (getTextWidth(jurusan, jurusanSize, jurusanFont) > maxWidthJurusan) {
    jurusanSize -= 1;
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = `${jurusanSize}px ${jurusanFont}`;
  ctx.textAlign = "center";
  ctx.fillText(jurusan, 480, 910);

  // GPA
  const avg = gpaInput1 + "/";
  const gpa = gpaInput2;
  ctx.font = `40px 'Moby', sans-serif`;
  ctx.textAlign = "right";
  ctx.fillText(avg, 865, 925);
  ctx.font = `25px 'Moby', sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(gpa, 870, 925);

  // Medal A
  const medalAFont = "'Gaboed Bold', sans-serif";
  const maxWidthMedalA = 350;
  let medalASize = 22;

  function getTextWidth(medalA, medalASize, medalAFont) {
    ctx.font = `${medalASize}px ${medalAFont}`;
    return ctx.measureText(medalA).width;
  }

  while (getTextWidth(medalA, medalASize, medalAFont) > maxWidthMedalA) {
    medalASize -= 1;
  }

  ctx.fillStyle = "#f5ca02";
  ctx.font = `${medalASize}px ${medalAFont}`;
  ctx.textAlign = "left";
  ctx.fillText(medalA, 145, 993);

  // Desc Medal A
  const descAFont = "'Gaboed Thin', sans-serif";
  const maxWidthDescA = 380;
  let descASize = 22;

  function getTextWidth(descA, descASize, descAFont) {
    ctx.font = `${descASize}px ${descAFont}`;
    return ctx.measureText(descA).width;
  }

  while (getTextWidth(descA, descASize, descAFont) > maxWidthDescA) {
    descASize -= 1;
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = `${descASize}px ${descAFont}`;
  ctx.textAlign = "left";
  ctx.fillText(descA, 145, 1020);

  // Medal B
  const medalBFont = "'Gaboed Bold', sans-serif";
  const maxWidthMedalB = 350;
  let medalBSize = 22;

  function getTextWidth(medalB, medalBSize, medalBFont) {
    ctx.font = `${medalBSize}px ${medalBFont}`;
    return ctx.measureText(medalB).width;
  }

  while (getTextWidth(medalB, medalBSize, medalBFont) > maxWidthMedalB) {
    medalBSize -= 1;
  }

  ctx.fillStyle = "#f5ca02";
  ctx.font = `${medalBSize}px ${medalBFont}`;
  ctx.textAlign = "left";
  ctx.fillText(medalB, 650, 993);

  // Desc Medal B
  const descBFont = "'Gaboed Thin', sans-serif";
  const maxWidthDescB = 340;
  let descBSize = 22;

  function getTextWidth(descB, descBSize, descBFont) {
    ctx.font = `${descBSize}px ${descBFont}`;
    return ctx.measureText(descB).width;
  }

  while (getTextWidth(descB, descBSize, descBFont) > maxWidthDescB) {
    descBSize -= 1;
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = `${descBSize}px ${descBFont}`;
  ctx.textAlign = "left";
  ctx.fillText(descB, 650, 1020);

  // Render Hasilnya
  outputImg.src = canvas.toDataURL();
  outputImg.style.display = "block";
  downloadButton.style.display = "inline-block";
}

downloadButton.addEventListener("click", () => {
  const outputImg = document.getElementById("generatedImage");
  const link = document.createElement("a");
  link.href = outputImg.src;
  link.download = "clash_of_timpa.png";
  link.click();
});
