var sessionId = "1_MX40NTE2NzE1Mn5-MTQyNTQxMDA0OTg5OX5QYmc2RTBiTlVZZE9iVDdtMHVTSkJMMGx-fg";
var token     = "T1==cGFydG5lcl9pZD00NTE2NzE1MiZzaWc9M2MzNDExYjExZWU2MDViN2YyYTkxNzI2MGEzNTZiYWU4ODhjM2Q5Njpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTFfTVg0ME5URTJOekUxTW41LU1UUXlOVFF4TURBME9UZzVPWDVRWW1jMlJUQmlUbFZaWkU5aVZEZHRNSFZUU2tKTU1HeC1mZyZjcmVhdGVfdGltZT0xNDI1NDEwMDczJm5vbmNlPTAuNDMzMzk1MzA0ODk2MjkwNCZleHBpcmVfdGltZT0xNDI4MDAxOTMy";
var apiKey    = "45167152";

var session = OT.initSession(apiKey, sessionId);

session.on("streamCreated", function(event) {
  session.subscribe(event.stream, "video-stream", { width: 480, height: 360 });
});

session.connect(token, function(error) {
  var publisher = OT.initPublisher("video-stream", { width: 480, height: 360 });
  session.publish(publisher);
});

session.on("signal:file", function(event) {
  if (event.from.id !== session.connection.id) {
    fileChunks.push(Base64Binary.decode(event.data));
  }
});

session.on("signal:eof", function(event) {
  if (event.from.id !== session.connection.id) {
    //console.log("File received");
    mergeFile(event.data);
  }
});

session.on("signal:eot", function(event) {
  if (event.from.id !== session.connection.id) {
    //console.log("All files received");
    clearFileList();
  }
});

document.getElementById('file_attachment').addEventListener('change', handleFiles, false);
