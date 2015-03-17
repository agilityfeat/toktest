var fileChunks = [];

var errorHandler = function(error) {
  if (error) {
    console.log("signal error (" + error.code + "): " + error.message);
  }
};

function sendChunk(fileChunk) {
  session.signal(
    {
      type: 'file',
      data: fileChunk
    },
    errorHandler
  );
};


function sendEOF(message) {
  session.signal(
    {
      type: 'eof',
      data: message
    },
    errorHandler
  );
};

function sendEOT() {
  session.signal(
    {
      type: 'eot',
    },
    errorHandler
  );
};


function handleFiles(event) {
  var file = event.target.files[0];

  var output = [];

  //console.log("Bytes sent: " + f.size);
  parseFile(file, sendChunk);

  var href = window.URL.createObjectURL(file);
  var filename = file.name;
  output.push('<p><a href="' + href +'" download="' + filename + '">' + filename + '</a> has been uploaded by you.</p>');

  sendEOT();
  file_list = document.getElementById("files");
  file_list.innerHTML = output.join('');
};

function parseFile(file, callback) {
  var fileSize = file.size;
  var chunkSize = 5 * 1024;
  var offset = 0;
  var self = this;
  var block = null;

  var foo = function(evt) {
    if (evt.target.error == null) {
      offset += chunkSize;
      callback(Base64Binary.encode(evt.target.result));
    } else {
      console.log("Read error: " + evt.target.error);
      return;
    }
    if (offset >= fileSize) {
      //console.log("File sent");
      sendEOF(file.name);
      return;
    }

    block(offset, chunkSize, file);
  };

  block = function(_offset, length, _file) {
    var reader = new FileReader();
    var blob = _file.slice(_offset, _offset + length);
    reader.onload = foo;
    reader.readAsArrayBuffer(blob);
  };

  block(offset, chunkSize, file);
};


function mergeFile(fileName) {
  var blob = new Blob(fileChunks);
  fileChunks.length = 0;

  var p = document.createElement('p');
  var href = window.URL.createObjectURL(blob);
  p.innerHTML = '<a href="' + href + '" download="' + fileName + '">' + fileName + '</a> has been uploaded by someone.';
  file_list = document.getElementById("files");
  file_list.appendChild(p);
};


function clearFileList() {
  file_list = document.getElementById("files");
  file_list.innerHTML = '';
};
