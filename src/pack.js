const fs = require('fs');
const path = require('path');
const glob = require('glob');
const zlib = require('zlib');

const pack = (dir, options, signature) => {
  options = Object.assign({ 
    nodir: true
  }, options);
  const files = glob
  .sync(`${dir}/**`, options)
  .map(filename => {
    const data = fs.readFileSync(filename);
    return {
      data,
      filename
    };
  });
  if(signature) {
    files.push({
      filename: "ci.signature",
      data: Buffer.from(signature)
    })
  }
 
  let datas = [], offset = 18 + (12 * files.length);
  const names = files.map(({filename, data}) => {
    filename = filename !== 'ci.signature' ? path.relative(dir, filename) : filename;
    const name = new Buffer.from(`/${filename.replace(/\\/g,'/')}`);
    offset += name.length;
    datas.push(data);
    return name;
  });

  // /ci.signature
  let metas = Buffer.concat(names.map((name, i) => {
    const data = datas[i];
    const meta = Buffer.concat([
      $(name.length, 4),
      name,
      $(offset, 4),
      $(data.length, 4)
    ]);
    offset += data.length;
    return meta;
  }));
  datas = Buffer.concat(datas);
  metas = Buffer.concat([
    $(files.length, 4)
  ].concat(metas));
  const header = Buffer.concat([
    $(0xBE),
    $(0x01, 4),
    $(metas.length, 4),
    $(datas.length, 4),
    $(0xED)
  ]);
  return zlib.gzipSync( Buffer.concat([ header, metas, datas ]));
};

const $ = (v, u = 1) => {
  const buffer = Buffer.alloc(u);
  switch(u){
    case 1: buffer.writeUIntLE(v, 0, 1); break;
    case 4: buffer.writeUInt32BE(v); break;
  }
  return buffer;
};

module.exports = pack;