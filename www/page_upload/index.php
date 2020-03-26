<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>upload</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Kanit&display=swap">
    <link rel="stylesheet" href="upload.css">
</head>

<body>
    <div class="container mt">
        <div class="row">
            <div class="col-sm-6">
                <div id="map"></div>
            </div>
            <div class="col-sm-6">
                <div class="dcard">
                    <h1 style="font-weight: bold">upload covid-19</h1>
                    <h4>อัพโหลดข้อมูล js</h4>
                    นำข้อมูลรายงานผู้ติดเชื้อมา join กับ <a href="upload/th_pro_sim_4326.zip">th_pro_sim_4326.shp</a> จากนั้นบันทึกเป็นไฟล์ geojson ก่อนอัพโหลดเข้าสู่ระบบ <br>
                    (ตัวอย่างไฟล์ที่ใช้ในการอัพโหลด <a href="upload/coviddata.geojson">coviddata.geojson</a>)
                    <hr>
                    <form enctype="multipart/form-data" action="index.php" method="POST">

                        <div class="form-group">
                            <input type="file" name="uploaded_file" accept=".geojson">
                        </div>
                        <hr>
                        <button type="submit" name="submit" value="Upload" class="btn btn-success">ส่งข้อมูล</button>
                        <button type="button" id="refresh" onclick="refreshPage()"
                            class="btn btn-outline-info">refresh</button>
                            <hr>
                            อัพเดท: <span id="update"></span>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
<script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"></script>
<!-- <script src="./upload/infected_prov.js"></script> -->
<script src="upload.js"></script>

</html>

<?PHP
  if(!empty($_FILES['uploaded_file']))
  {
    $path = "upload/";
    $path = $path . basename( $_FILES['uploaded_file']['name']);

    if(move_uploaded_file($_FILES['uploaded_file']['tmp_name'], $path)) {
    //   echo "The file ".  basename( $_FILES['uploaded_file']['name'])." has been uploaded";
    } else{
        echo "There was an error uploading the file, please try again!";
    }
  }
?>