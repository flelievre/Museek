<html>
	<head>
		<title>Museek</title>
		
		<link href='//fonts.googleapis.com/css?family=Lato:100' rel='stylesheet' type='text/css'>
        <link rel="shortcut icon" href="{{{ asset('img/favicon.ico') }}}">

		<style>
			body {
				margin: 0;
				padding: 0;
				width: 100%;
				height: 100%;
				color: #B0BEC5;
				display: table;
				font-weight: 100;
				font-family: 'Lato';
			}

			.container {
				text-align: center;
				display: table-cell;
				vertical-align: middle;
			}

			.content {
				text-align: center;
				display: inline-block;
			}

			.title {
				font-size: 110px;
				margin-bottom: 10px;
                color:#FF3838;
			}

			.quote {
				font-size: 24px;
				margin-bottom: 100px;
			}
            a {
                font-size: 27px;
                text-decoration:none;
                color:#777
            }
		</style>
	</head>
	<body>
		<div class="container">
			<div class="content">
				<div class="title">Museek</div>
				<div class="quote">Music sounds better when shared</div>
                <a href="{{URL::to($url)}}"><img src={{asset('img/connect.png')}} alt="Logo"></a>
			</div>
		</div>
	</body>
</html>
