const { login, preview } = require("./index");
const qrcode = require("qrcode-terminal");

(async () => {
  let newticket = "40yCLQ_vPUNoo5xfsKCMevzv78EdtdnvHbEFwpwDN-E";

  //    const { newticket } =  await login()
  //    console.log(newticket)  40yCLQ_vPUNoo5xfsKCMevzv78EdtdnvHbEFwpwDN-E

  const data = await preview("/Users/nomac/insurance-mp/dist", newticket, {
    appid: "wx977351aca2cf498c",
    path: "pages/prePage/index"
  });
  qrcode.generate(data.url, { small: true });
})();
