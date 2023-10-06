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

    pagebuilder: function(el="default", data="") {

      var index = "", elem = $(el), 
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
          elem.append($('<i/>', {class:"add-module temp fa fa-circle-plus", title:'Add Module', onclick: "mdev.pagebuilder(this, 'add');"})).removeClass('mdevtemp');
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
          elem.append($('<div/>', {class:index+'-setting-buttons setting-buttons'})
            .append($('<i/>', {class:"fa fa-gear", title:mdev.ucwords(index)+' Settings', onclick: "mdev.pagebuilder(this, 'settings');"}))
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
          break;

        case "delete":
          var parent = elem.parents(':eq(1)');
              index = mdev.pagebuilder(parent, 'index');
          if(parent.parent().find('.'+index).length==1) 
          index=='module' ? mdev.pagebuilder(parent.parent(), 'add-module') : mdev.pagebuilder(parent.parent(), index);
          parent.remove();
          break;

        case "default":

          var cn = mdev.get('mdevpagebuilder'),
              elem = $('.'+cn), 
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

          elem.addClass('mdevpagebuilder')
          .find('.section, .row, .module').each(function(){
            mdev.pagebuilder(this, 'action');
            if(mdev.pagebuilder(this, 'index')=='section' 
            && !$(this).find('.row').length) 
              mdev.pagebuilder($(this), 'row');
          });

          break;

      }

    }

  }

  $(document).ready(function() { 
    if(mdev.get('mdevpagebuilder')) mdev.pagebuilder();
}); })(jQuery)
