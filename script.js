(function($){

  mdev = {

    get: function(id) {
      var search = window.location.search,
        search = search.replace("?", ""),
        search = search.replace( /=/g, '":"' ),
        search = search.replace( /&/g, '","' ),
        search = search.replace( "?", "" );
        search = search ? $.parseJSON('{"'+search+'"}') : "";
        return search[id];
    },
    
    uniqueId: function() {
      return Math.round(new Date().getTime() + (Math.random() * 100));
    },
    
    ucwords: function(str) {
      return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
          return $1.toUpperCase();
      });
    },

    module: function(el, caze) {

      var elem = $(el);
      switch(caze) {
        case 'toggle':
          elem.click(function(){
            var parent = $(this).parent();
            parent.hasClass('open') 
              ? parent.removeClass('open').find('.toggle-content').slideUp()
              : parent.addClass('open').find('.toggle-content').slideDown();
          });
          break;

      }

    },

    pagebuilder: function(el="default", data="") {

      var i=1, index = "", elem = $(el), 
          content = mdev.get('mdevpagebuilder'),
          caze = elem.length ? data : el,
          caze = data.caze ? data.caze : caze; 

      switch(caze) {

        case "section":
          el = $('<section/>', {class:"section mdevtemp"});
          elem.hasClass('section') ? elem.after(el) : elem.append(el);
          mdev.pagebuilder('.section.mdevtemp', 'row');
          mdev.pagebuilder('.section.mdevtemp', 'action');
          $('.section.mdevtemp').removeClass('mdevtemp');
          break;

        case "row":
          elem.append($('<div/>', {class:"row mdevtemp"}));
          mdev.pagebuilder('.row.mdevtemp', 'column'); 
          mdev.pagebuilder('.row.mdevtemp', 'action');
          $('.row.mdevtemp').removeClass('mdevtemp');
          break;

        case "column":
          elem.append($('<div/>', {class:"column mdevtemp"}));
          mdev.pagebuilder('.column.mdevtemp', 'add-module');
          $('.column.mdevtemp').removeClass('mdevtemp');
          break;

        case "add-module":
          elem.append($('<i/>', {class:"mdevpagebuilder-add-module mdevtemp fa fa-circle-plus", title:'Add Module', onclick: "mdev.pagebuilder(this, 'add');"})).removeClass('mdevtemp');
          break;

        case "module":
          elem.append($('<div/>', {class:"module mdevtemp"}).html($('<div/>', {class:'module-content'})));
          mdev.pagebuilder('.module.mdevtemp', 'action');
          $('.module.mdevtemp').removeClass('mdevtemp');
          break;

        case "index":
          return elem.hasClass('row') ? 'row' : (elem.hasClass('module')?'module':"section");
          break;

        case "action":
          index = mdev.pagebuilder(el, 'index');
          elem.append($('<div/>', {class:'mdevpagebuilder-'+index+'-buttons mdevpagebuilder-buttons'})
            .append($('<i/>', {class:"fa fa-gear", title:mdev.ucwords(index)+' Settings', onclick: "mdev.pagebuilder(this, 'edit');"}))
            .append($('<i/>', {class:"fa fa-trash-can", title:'Delete '+mdev.ucwords(index), onclick: "mdev.pagebuilder(this, 'delete');"}))
            .append($('<i/>', {class:"add-"+index+" fa fa-circle-plus", title:'Add '+mdev.ucwords(index), onclick: "mdev.pagebuilder(this, 'add');"}))
          );
          break;

        case "add":
          var parent = elem.parents(':eq(1)'),
              index = mdev.pagebuilder(parent, 'index');

          if(index=='section') 
          mdev.pagebuilder(parent, 'section'); 
          else {

          } 
          $('.mdevpagebuilder-settings').fadeOut();
          mdev.pagebuilder('classes');
          break;

        case "delete":
          var parent = elem.parents(':eq(1)');
              index = mdev.pagebuilder(parent, 'index');
          if(parent.parent().find('.'+index).length==1) 
          index=='module' ? mdev.pagebuilder(parent.parent(), 'add-module') : mdev.pagebuilder(parent.parent(), index);
          $('.mdevpagebuilder-settings').fadeOut();
          parent.remove();
          break;

        case "edit":

          var parent = elem.parents(':eq(1)');
          $('.mdevactive').removeClass('.mdevactive');
          parent.attr('data-id', mdev.uniqueId()).addClass('mdevactive');
          $('.mdevpagebuilder-settings').fadeIn();

          elem = $('.mdevactive');

          break;

        case "classes":

          $('.'+content).find('.section').each(function(){
            var r = 1; $(this).attr('class', 'section-'+i+' section');
            $('.row', this).each(function(){
              var c = 1; $(this).attr('class', 'row-'+r+' row');
              $('.column', this).each(function(){
                var m = 1; $(this).attr('class', 'column-'+c+' column');
                $('.module', this).each(function(){ $(this).attr('class', 'module-'+m+' module');
          m++; }); c++; }); r++; }); i++; });
          
          break;

        case "settings":

          var pbs = 'mdevpagebuilder-setting',
              setting = $('.'+pbs+'s'),
              fields = {
                'background' : ['background_color', 'background_image'], 
                'spacing' : ['margin', 'padding'],
                'style' : ['main_style', 'before', 'after'], 
                'position' : ['position', 'z_index'],
                'css' : ['id', 'class']
              }, 
              title = {
                'background_color' : 'Color', 
                'background_image' : 'Image',
                'css' : 'CSS ID & Classes', 
                'style' : 'Custom CSS', 
                'z_index' : 'Z Index', 
                'main_style' : 'Main'
              },
              select = {
                'position' : ['Default', 'Relative', 'Absolute', 'Fixed']
              },
              style = ['background', 'spacing', 'position', 'style'],
              textarea = ['main_style', 'before', 'after'];


          $('body').append(
            $('<div/>', {class:pbs+'s mdev'})
            .append($('<a/>', {href:'#', class:pbs+'-close'})
              .click(function(e){ $(this).parent().fadeOut(); e.preventDefault(); })
              .html($('<i/>', {class:'fa-solid fa-circle-xmark'})))
            .append($('<div/>', {class:pbs+'-header', text:'Settings'}))
            .append($('<div/>', {class:pbs+'-body'})
              .append($('<div/>', {class:pbs+'-content'})
                .append($('<div/>', {id:pbs+'-fields'})
              )
            )));

            $.each( fields, function ( index, value ) {
              $('#'+pbs+'-fields').append($('<div/>', {class:index+"-toggle toggle"})
                .append($('<h4/>', {class:"toggle-title", text:title[index]?title[index]:index}))
                .append($('<div/>', {class:"toggle-content tgl"+i}))
              );
              $.each( value, function ( field, name ) {
                var content = ""; 
                    input = $.inArray(name, textarea) != -1 ? 'textarea' : 'input', 
                    input = select[name] ? 'select' : input;
                if(select[name]) 
                $.each( select[name], function ( key, val ) {
                content += '<option value="'+val+'">'+val+'</option>'; });
                $('.tgl'+i).append($('<p/>')
                .append($('<label/>', {text:title[name]?title[name]:name}))
                .append($('<'+input+'/>', {type:input, name:name, html:content, 
                  class:$.inArray(index, style) != -1? 'csstyle mdevfield' : "mdevfield"
                })));
              }); $('.tgl'+i).removeClass('tgl'+i);
            i++; });

            setting = $('.'+pbs+'s');
            mdev.module(setting.find('.toggle-title'), 'toggle');
            setting.find('textarea, select').removeAttr('type');

          break;

        case "default":

          var elem = $('.'+content), 
              content = elem.html();

          if(!elem.find('.section').length) {
            elem.html(""); 
            mdev.pagebuilder(elem, 'section');
            if(content.trim()) {
              mdev.pagebuilder(elem.find('.column'), 'module');
              $('.module-content').attr('class', 'text-module').html(content);
              $('.add-module.temp').remove();
            } 
          }
          elem.addClass('mdevpagebuilder');
          elem.find('.column').each(function(){
            $('.module', this).length ? "" : 
            mdev.pagebuilder(this, 'add-module');
          });
          elem.find('.section, .row, .module').each(function(){
            if(mdev.pagebuilder(this, 'index')=='section' 
              && !$(this).find('.row').length) 
              mdev.pagebuilder($(this), 'row');
              mdev.pagebuilder(this, 'action');
          });

          mdev.pagebuilder('classes');
          mdev.pagebuilder('settings');
          break;

      }

    }

  }

  $(document).ready(function() { 
    if(mdev.get('mdevpagebuilder')) mdev.pagebuilder();
}); })(jQuery)
