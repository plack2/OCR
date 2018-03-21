/*
GoogleドライブのOCR技術を使って画像の文字をGoogleドキュメントに書き出す。
Google Apps Scriptで、複数の画像の文字を１つのドキュメントにまとめるプログラム。

GitHubへの公開初めてなので、何かあればコメントください

※一度に大量の画像をOCRにかけると、Google Apps Scriptの５分の壁に抵触し、タイムアウトエラーになる可能性があります。
公開日：2018年3月21日
*/

function myFunction() {

  var uploder = DriveApp.getFolderById("画像をアップロードするフォルダのIDを入力")
  var files = uploder.getFiles() //ファイル一覧
  
  var arr = [];
  
  while(files.hasNext()){
    var loadFile = files.next();
    arr.push({name:loadFile.getName(), id:loadFile.getId()}); //連想配列に格納
  }

 //連想配列をソート
  arr.sort(function(a,b){
    if(a.name<b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  });
  
  //連想配列を取り出し、OCR技術を使ってドキュメントにテキストを書き出す
  for (key in arr){
    
    var fileName = arr[key].name;    
    var fileId = arr[key].id;
  
    var image = DriveApp.getFileById(fileId); //画像データのIDを取得
    var imageBlob = image.getBlob(); //Blobを取得
    
    var resource = {
      title: imageBlob.getName(),
      mimeType: imageBlob.getContentType(),
      parents: [{"id": "保存先（生成先）フォルダのIDを入力"}]
    };
    var options = {
      ocr: true
    };  
    
    //OCFで読み取ったテキストをGoogleドキュメントとして、Googleドライブに作成
    var file = Drive.Files.insert(resource, imageBlob, options);
    
    //作成したGoogleドキュメントの内容を書き出し
    var doc = DocumentApp.openById(file.id);
    var text = doc.getBody().getText();
    
    //Googleドキュメントにテキストを追記
    var write = DocumentApp.openById("書き込み先となるGoogleドキュメントのIDを入力");
    write.appendParagraph(fileName); //画像ファイル名の書き込みが不要の場合はこの行を削除
    write.appendParagraph(text);
  
  }
  
}