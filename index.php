<!DOCTYPE html>
<html>
	<head>
    <title>MDev Page Builder</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="style.css?time=<?php echo time(); ?>" rel="stylesheet" type="text/css">
    <style type="text/css"> 
      @import url('https://fonts.googleapis.com/css2?family=Figtree&display=swap');
      body {
        font-family: 'Figtree', sans-serif;
        font-size: 15px;
        margin: 0;
      }
      a {
        text-decoration: none;
      }
    </style>
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
    <script src="script.js?time=<?php echo time(); ?>" type="text/javascript"></script>

  <body>
   
    <div class="content">

    <section class="section-1">
  <div class="row-1 row">
    <div class="column-1 column">
      <div class="modal-module module-1 module">
        <div class="module-base">
          <a href="#modal">
            <span class="module-title">Label Here</span>
          </a>
          <div class="module-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</div>
        </div>
      </div>
      <div class="modal-module module-2 module">
        <div class="module-base">
          <a href="#modal">
            <span class="module-title">MOdal</span>
          </a>
          <div class="module-content">MOdal</div>
        </div>
      </div>
      <div class="toggle-module module-3 module">
        <div class="module-base">
          <h4 class="module-title">Text Here</h4>
          <div class="module-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</div>
        </div>
      </div>
    </div>
    <div class="column-2 column">
    </div>
    <div class="column-3 column">
    </div>
  </div>
</section>

    </div>
    
  </body>
</html>
