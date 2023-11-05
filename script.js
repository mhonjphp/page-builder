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

    print: function(arr){
      return JSON.stringify(arr,null,'\t').replace(/\t/g,'   '); 
    }, 

    filter: function(arr) {
      var datas={}; $.each( arr, function ( index, value ) { if(value) datas[index]=value; }); return datas;
    }, 
    
    uniqueId: function() {
      return Math.round(new Date().getTime() + (Math.random() * 100));
    },
    
    ucwords: function(str) {
      return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
          return $1.toUpperCase();
      });
    },

    between: function(s, a, b) {
      var p = s.indexOf(a) + a.length;
      return s.substring(p, s.indexOf(b, p));
    }, 

    string: function(str1, str2="", str3="") {
      var string, index=str2.indexOf("%s") >= 0;
      string = str1 ? str1 : str2;
      string = index && str1 ? str2.replace('%s', str1) : string;
      string = index && !str1 ? str3 : string;
      return string;
    },

    isobject: function(string) {
      return typeof string === 'object' ? true : "";
    }, 

    strobject: function(arr, a="", b="") {

      if(!arr) return false;
      var arr1 = {}, string = "",
          object = mdev.isobject(arr) ? true : "",
          arr2 = object ? arr : arr.split(a);

      $.each( arr2, function ( index, value ) {
        if(object) {
          if(!mdev.isobject(value)) 
          string += (b==";\n"?"  ":"")+index+a+(b==";\n"?" ":"")+value+b; 
        } else {
          value = value.split(b);
          index = value[0].trim();
          if(value[0]&&value[1]) arr1[index] = value[1].trim();
        }
      }); return object ? string : arr1;

    },

    notice: function(message, status='success', classname="") {
      var classname = classname ? classname+" " : "";
      return $('<div/>').addClass(classname+'mdevpb-'+status).html(message);
    },

    module: function(el, module, action) {

      if(action) {
        
        var clasz = module+'-module';
        elem = $(el).length ? $(el).find('.'+clasz) : $('.'+clasz);
        elem = $(el).hasClass(clasz) ? $(el) : elem;

        switch(module) {

          case 'modal':
  
            elem.find('.module-title').parent().click(function(e){
            
              var parent = $(this).parent(),
                  content = parent.find('.module-content');
              
              $('body').addClass('modal-module-open');
              if(!parent.find('.module-container').length)
              content.replaceWith($('<div/>', {
                class: 'module-container', 
                html: $('<div/>', { class: 'module-inner'})
                  .append($('<div/>', {
                    class: 'module-table', 
                    html: $('<div/>', {
                      class: 'module-cell', 
                      html: $('<div/>', {class: 'module-content'})
                        .append($('<a/>', {href:"#", class:'module-close', html:$('<i/>', {class:'fa fa-times-circle'})}))
                        .append(content.html())
                    })
                  }))
              })); 
              
              parent.find('.module-content').click(function(e){ e.stopPropagation(); });
              parent.find('.module-container, .module-close').click(function(e){
                $('body').removeClass('modal-module-open');
                parent.find('.module-container').after(parent.find('.module-content'));
                parent.find('.module-container, .module-close').remove();
                e.preventDefault();
              }); e.preventDefault();
  
            }); break;
  
          case 'toggle':
  
            (elem.hasClass('mdevpb-handle') ? elem : elem.find('.module-title')).click(function(){
              var parent = $(this).parent(), 
                  parent = $(this).hasClass('mdevpb-handle') ? parent.find('.module-base') : parent;
              parent.hasClass('module-open') 
                ? parent.removeClass('module-open').find('.module-content').slideUp()
                : parent.addClass('module-open').find('.module-content').slideDown();
            });
  
            break;
        }


      } else module ? mdev.module(el, module, true)
        : $.each( ($(el).length ? ['modal', 'toggle'] : [el]), function ( index, module ) { 
          mdev.module($(el), module, true);  });

    },

    pagebuilder: function(el="default", data="") {

      var i=1, index = "", arr={}, 
          items = "", elem = $(el), 
          caze = elem.length ? data : el,
          caze = data.caze ? data.caze : caze, 
          container = $('.mdevpagebuilder'), 
          elems = 'section,.row,.column,.module', 
          setting = $('.mdevpb-settings'), 
          location = window.location.href.split("?")[0], 
          image = location+"assets/no-image.jpg", 
          headings = ['h1','h2','h3','h4','h5','h6']; 

      switch(caze) {

        case 'button':

          var index = mdev.pagebuilder(elem.parents(), 'index'),
              index = index=='column' ? 'module' : index, 
              index = data.single ? mdev.string(data.index, 'module') : index, 
              action = data.single ? 'add' : data.action, 
              clasz = data.single ? 'mdevpb-cancel-sort mdevpb-add-'+index+' mdevpb-btn-action ' : "";

          elem.append($('<button/>', {
            class: clasz+'mdevpb-'+action, 
            onclick: "mdev.pagebuilder(this, '"+action+"');",
            title: mdev.ucwords(action+' '+index)
          }));

          break;

        case 'action':
          index = mdev.pagebuilder(elem, 'index'),
          elem.append($('<div/>', {class:'mdevpb-'+index+'-action mdevpb-action mdevpb-cancel-sort'}));
          $.each( ['edit','delete','add'], function ( key, action ){
            var index = mdev.pagebuilder(elem.parents(':eq(1)'), 'index');
            mdev.pagebuilder(elem.find('.mdevpb-action'), {caze:'button', action:action}); 
          });
          break;

        case 'index':
          
          index = elem.is('section') ? 'section' : "";
          index = elem.hasClass('row') ? 'row' : index;
          index = elem.hasClass('column') ? 'column' : index;
          return elem.hasClass('module') ? 'module' : index;
          break;

        case 'id':

          var i = elem.index()+1;
          return elem.hasClass('row')||elem.hasClass('column')||elem.hasClass('module') 
          ? mdev.pagebuilder(elem.parent(), 'id')+i : i;

          break;

        case 'class':

          var i = elem.index()+1
              index = mdev.pagebuilder(el, 'index'), 
              clasz = "."+index+"-"+i;

          clasz = index=='row'||index=='column'||index=='module' 
          ? mdev.pagebuilder(elem.parent(), 'class')+" "+"."+index+"-"+i : "."+index+"-"+i;
          return clasz;

          break;

        case 'classes':

          var classes = "", i = elem.index()+1, 
              index = mdev.pagebuilder(el, 'index'), 
              remove = ["mdevpb-active", "ui-sortable-handle", "ui-sortable"], 
              modules = $.merge(mdev.pagebuilder('module', 'keys'),['text']);

          $.each( elem.attr('class').split(" "), function ( key, classname ) {
            var cn = classname.split('-'), 
                classname = data.attribute ? classname : classname.replace('column-w', "").replace('mdevpb-module-temp', ""), 
                clasz = $.inArray(classname, remove) == -1 ? true : "";
                clasz = $.inArray(classname.replace("-module", ""), modules) == -1
                || data.attribute ? clasz : "";
                clasz = cn[0]==index && $.isNumeric(cn[1]) ? "" : clasz;
                clasz = $.isNumeric(classname) ? "" : clasz;
                clasz = classname==index ? "" : clasz;
          if(clasz) classes += classname+" "; });
          return classes.replace('content-module','text-module').trim();

          break;

        case 'attribute':

            var i = elem.index()+1,
                id = mdev.pagebuilder(el, 'class').replace(/\D/g,''),
                index = mdev.pagebuilder(el, 'index');

            if(!elem.hasClass('row')&&!elem.hasClass('column')
            &&!elem.hasClass('module')&&!elem.is('section')) return false;

            elem.data('id') ? "" : elem.attr('data-id', mdev.uniqueId()+id);
            elem.attr('class', mdev.string(data.class,"%s ")+mdev.pagebuilder(elem, {caze:'classes', attribute:true}));
            elem.removeClass(index);
            elem.addClass(index+"-"+i);
            elem.is('section') ? "" : elem.addClass(index);

            index=='section'&&!elem.find('.row').length 
              ? mdev.pagebuilder(elem, {caze:'button', index:'row', single:true}) : "";
            index=='column'&&!elem.find('.module').length 
              ? mdev.pagebuilder(elem, {caze:'button', single:true}) : "";

            index=='column' ? ""  : mdev.pagebuilder(el, 'action');
            elem.append($('<div/>', {class:'mdevpb-'+index+'-handle mdevpb-handle'}));

          break;

        case 'data':

          var datas = {}, arr = {}, arr2 = {},
              id = $('.mdevpb-active').data('id');
              style = $(".mdevpb-style").html(), 
              html = $(".mdevpb-data").html(), 
              json = html ? $.parseJSON(html) : {};

          if( !html ) {
            
            $.each( style.split('}'), function ( index, value ) {
              value = value.split('{');
              if(value[0]&&value[1]) 
              arr[value[0].trim()] = mdev.strobject(value[1], ";", ":");
            }); 

            $.each( arr, function ( index, value ) {
              $.each( index.split(" "), function ( key, value ) {
                var btwn = mdev.between(value,".",":"), 
                    id = value.replace("."+btwn+":", ""), 
                    str = btwn&&btwn!="."?":":" ",
                    key = index.replace((str)+id, "");
                if(!arr[key]) arr[key] = {};
                if(arr[key+str+id]) arr[key][id] = arr[key+str+id];
                delete arr[key+str+id]; });

            }); 

          }
          
          if(mdev.isobject(el)) 
          json[id] = $.extend(json[id], el);

          container.find(elems).each(function(){

            var module = "", 
                elem = $(this), 
                id = elem.data('id');

            $.each( mdev.pagebuilder('module', 'keys'), function(index, id){
              index = id=='content'?'text':id;
              if(elem.hasClass(index+'-module')) module = id; });

            datas[id] = $.extend(mdev.filter({
              id      : elem.attr('id'), 
              class   : mdev.pagebuilder(this, 'classes'), 
              design  : (html ? (json[id]?json[id]['design']:"") : arr[mdev.pagebuilder(this, 'class')]),
              module  : module
            }),json[id]);

          });

          $(".mdevpb-data").html(JSON.stringify(datas));
          return data=='%s' ? datas[id] : datas;

          break;

        case 'sortable':

          $('.mdevpagebuilder, section, .row, .column').each(function(){
            var index = mdev.pagebuilder(this, 'index');
            $(this).sortable({
              stop: function(event, ui) {  
                setting.hide();
                mdev.pagebuilder('elements'); 
                $('.mdevpb-active').removeClass('mdevpb-active');
              }, cancel:".mdevpb-cancel-sort", handle: '.mdevpb-handle', 
              connectWith: (index=='section' ? "section" : (index=='column' ? ".column" : ""))
            });
          });

          break;

        case 'css':

          var style = "";
          $.each( mdev.pagebuilder('data'), function(index, value){
            var clasz = mdev.pagebuilder('[data-id="'+index+'"]', 'class');
            if(value.design) {
              var i=1, 
                  design = mdev.strobject(value.design, ":", ";\n");
              if(design) style += clasz+" {\n"+design+"}\n\n";
              $.each( value.design, function(index, value){
                if(mdev.isobject(value)) {
                  index = $.inArray(index, ['before','after']) != -1 ? ":"+index : " "+index;
                  style += clasz+index+" {\n"+mdev.strobject(value, ":", ";\n")+"}\n\n";
                }
              });
            } }); $('.mdevpb-style').html(style);

          break;

        case 'elements':

          container = $('.'+mdev.get('mdevpagebuilder'));
          $('.mdevpb-cancel-sort, .mdevpb-handle').remove();

          container.children().each(function(){
          mdev.pagebuilder(this, 'attribute'); });

          container.find(elems).children().each(function(){
          if(!$(this).parent().hasClass('module')) mdev.pagebuilder(this, 'attribute'); });

          mdev.pagebuilder('data');
          mdev.pagebuilder('css');
          mdev.module('.mdevpagebuilder');
        //  mdev.module('.toggle-module .mdevpb-handle', 'toggle');

          container.find('.module-base').each(function(){
            var clasz = mdev.pagebuilder(this, 'classes'), 
                clasz = clasz.replace("module-base", ""), 
                clasz = clasz.replace("module-", "").trim();
            if(clasz) $(this).attr('data-class', clasz);
          });

          break;

        case 'element':

          var index = mdev.pagebuilder(el, 'index'),
              element = index=='section'?'section':'div';

          return $('<'+element+'/>', {class:index+" mdevpb-temp"}); 

          break;

        case 'add':

          var rowdule = data.structure, 
              rowdule = data.module ? data.module : rowdule
              parent = elem.parents(':eq(1)'), 
              parent = rowdule ? $('.mdevpb-active') : parent, 
              parent = elem.hasClass('mdevpb-btn-action') ? elem : parent, 
              index = mdev.pagebuilder(parent, 'index'), 
              index = elem.hasClass('mdevpb-btn-action') ? (elem.hasClass('mdevpb-add-row')?'row':'module') : index,
              index = rowdule ? 'section' : index,
              section = mdev.pagebuilder(parent, 'element'),
              element = $('<div/>', {class:'row mdevpb-temp'}).html($('<div/>', {class:'column'})), 
              element = data.module ? $('<div/>', {class:elem.data('id')+'-module module mdevpb-module-temp'}).html($('<div/>', {class:'module-base'})) : element;

          $('.mdevpb-active').removeClass('mdevpb-active');
          mdev.pagebuilder('default-setting', {module: data.module});

          if(index=='section') {

            parent.after(rowdule ? element : section);
            if( data.structure ) {
              var i = elem.data('id'),
                  num = i==9 || i==10 ? 3 : i,
                  num = i==7 || i==8 ? 2 : num;
              $('.row.mdevpb-temp').html("");
              for (let x = 0; x < num; x++) {
                var clasz = i==7&&x==0||i==8&&x==1 ? 'column-w33' : "", 
                    clasz = i==7&&x==1||i==8&&x==2 ? 'column-w66' : clasz, 
                    clasz = i==9&&x==1||i==10&&x==0 ? 'column-w60' : clasz, 
                    clasz = i==9&&x==0||i==9&&x==2||i==10&&x==1||i==10&&x==2 ? 'column-w20' : clasz;
                $('.row.mdevpb-temp').append($('<div/>', {class:clasz}).addClass('column'));
              }
            }  
          
            rowdule ? "" : $('section.mdevpb-temp').html(element);
            $('.mdevpb-temp').removeClass('mdevpb-temp');
            data.module ? $('.mdevpb-module-temp').parent().find('.mdevpb-btn-action').remove() : "";
            mdev.pagebuilder('elements');
            data.module ? $('.mdevpb-module-temp').addClass('mdevpb-active').removeClass('mdevpb-module-temp') : "";

          } else {

            setting.find('.mdevpb-content').children().hide();
            setting.fadeIn().find(index=='row'?'.mdevpb-structure':'.mdevpb-modules').show();
            setting.find('.mdevpb-heading').text('Insert '+index);
            parent.addClass('mdevpb-active');

          }
            
          break;

        case 'edit':

          var style = "", title = "",
              elem = elem.parents(':eq(1)'), 
              index = mdev.pagebuilder(elem, 'index'),
              modules = mdev.pagebuilder('module', 'data');

          $('.mdevpb-active').removeClass('mdevpb-active');

          elem.addClass('mdevpb-active');
          data = mdev.pagebuilder('data', '%s');

          $.each( data, function ( index, value ) {

            if(mdev.isobject(value))
            $.each( value, function ( index, value ) {

              var field = setting.find('[name="'+index.replace(/-/g, '_')+'"]'), 
                  value = index=='background-image' ? value.slice(4, -1) : value;
                
              if(mdev.isobject(value)) {
                arr[index] = mdev.strobject(value, ":", ";\n");
                $.each( value, function ( index1, value ) {
                  index = $.inArray(index, headings) != -1 ? 'heading' : index;
                  arr[index.replace('.module-',"")+"-"+index1] = value; 
                });
              } else {
                if(field.length) arr[index]=value;
                else style += index+": "+value+";\n"; 
              }

              if(index=='background-image'&&value)
              setting.find('#background-toggle img').attr('src', value);

            }); else arr[index] = value;

          });
          
          arr['style'] = style;
          mdev.pagebuilder('default-setting', arr)

          setting.fadeIn().find('.mdevpb-fields').show();
          setting.find('.mdevpb-heading').text(mdev.string(data.module, index)+" Settings");

          if(data.module) {

            var elem = $('.mdevpb-active'),
                content = elem.find('.module-base'), 
                modules = modules[data.module].modules;

            if($.inArray('content', modules) != -1
            || data.module=='content') {
              data.content = elem.find('.module-content').html();
              data.content = data.content.replace(/\s\s+/g, "");
              data.content = data.content.replace(/<br>/g, "\n");
            } 

            $.each( modules, function ( index, module ) { 
            arr[module+"_link"] = elem.find('.module-'+module).parent().attr('href'); });
            
            mdev.pagebuilder('module', $.extend(data, arr));

          }  

          break;

        case 'delete':

            var el = elem.parents(':eq(1)'),
                parent = el.parent(), 
                i = parent.find('section').length;

            if(i==1) 
            mdev.pagebuilder(elem, 'add');
            el.remove();
            mdev.pagebuilder('elements');
            setting.fadeOut();

            break;


        case 'input':

          if(!data.each) {

            elem.find('.mdevpb-field').each(function(){
            var field = $(this), 
              action = field.is(':checkbox') 
              || field.is(':radio') 
              || field.is('select') ? 'change' : 'keyup';
            field.on(action, function(){ mdev.pagebuilder(this, {caze:'input', each:true}); }); });

            return false;

          }

          var design = {}, arr2 = {},
              elem = $('.mdevpb-active'), 
              i = elem.index()+1;
              index = mdev.pagebuilder(elem, 'index'), 
              data = mdev.pagebuilder('data', '%s'), 
              content = elem.find('.module-container'), 
              modules = mdev.pagebuilder('module', 'data');

          setting.find('#background-toggle img').attr('src', image);

          $('.mdevpb-fields .mdevpb-field').each(function(){
            var field = $(this), 
                name = field.attr('name'), 
                value = field.val(); 
            if(value && !field.hasClass('element')) {
              if(field.hasClass('design')) {
                design[name.replace("_","-")] = value.replace(/</g, "");
                if(name=='background_image') {
                  design['background-image'] = 'url('+value+')';
                  design['background-size'] = 'cover';
                  design['background-position'] = 'center';
                  setting.find('#background-toggle img').attr('src', value);
                 }
              } else if(field.hasClass('design2')) {
                name = name.split("_")[0];
                arr2[($.inArray(name, ['before','after']) == -1 ?".module-":"")+name] = el;
              } else if(field.hasClass('designs')) {
                if(name=='style') design = $.extend(design, mdev.strobject(value, ";", ":")); 
                else design[name] =  mdev.strobject(value, ";", ":");
              } else arr[name] = value.replace(/</g, ""); 
            }
            
            if(field.hasClass('element'))
            mdev.pagebuilder('module', {input:true, module:data.module});

          });

          $.each( arr2, function ( index, value ) {
            var arr3 = {}
            $('.mdevpb-fields .design2').each(function(){
              if($(this).val()) {
                var name = $(this).attr('name'),
                    el = name.split("_")[0];
                    key = name.replace(el+"_", ""), 
                    key = key.replace(/_/g, '-'),
                    key = key.replace('heading-', "");
              if(index=='.module-'+el) arr3[key] = $(this).val().replace(/</g, ""); }
            }); design[index] = arr3;
          });

          $('.mdevpb-fields .xd').each(function(){
          delete arr[$(this).attr('name')]; });
          delete design.heading;

          arr.design = design; 
          mdev.pagebuilder(arr, 'data');
          mdev.pagebuilder('css');

          arr.id ? elem.attr('id', arr.id) : elem.removeAttr('id');
          arr.class = mdev.string(arr.class, "%s ", "");
          arr.class = data.module ? arr.class+(data.module.replace('content','text'))+"-module " : arr.class;
          elem.attr('class', arr.class+index+"-"+i+" "+index+" mdevpb-active");

          break;

        case 'field':

          var name = data.name, 
              fg1 = ['select', 'textarea'], 
              fg2 = ['checkbox', 'radio'], 
              type = mdev.string(data.type, "text"), 
              type = data.switch ? 'checkbox' : type,
              type = name.indexOf("select")>= 0  ? 'select' : type,
              tag = $.inArray(type, fg1) != -1 ? type : "input",
              id = mdev.string(data.id, name), 
              id = (id+"-field").replace(/_/g, '-'),
              clasz = mdev.string(data.class, '%s'),
              span = mdev.string(data.label, name), 
              span = clasz.indexOf("design2") >= 0 && !data.label ? span.replace(span.split("_")[0], "") : span,
              label = $('<label/>', {
                for: name, 
                class: (data.switch ? "mdevpb-field-switch " : "")+'mdevpb-field-label', 
                append: $('<span/>', {text:mdev.ucwords(span).replace(/_/g, ' ')})
              }), 
              input = $('<'+tag+'/>', {type:type, id:name, name:name, 
                class: mdev.string(data.clasz, "%s ")+mdev.string(data.class, "%s ")+"mdevpb-field", 
                value: data.value, 
                placeholder: data.placeholder
              }).prop('checked', data.checked),
              after = data.after,  
              field = $('<div/>', {
                id: id, 
                class: mdev.string(data.container_class, "%s ")+'mdevpb-field-'+type+" mdevpb-field-container", 
              });

          if(data.for&&data.for==data.module||!data.for)
          elem.append(field.append(label.prepend(data.switch ? $('<span/>', {class:'mdevpb-field-switch-helper'}) : "").prepend($.inArray(type, fg2) != -1?input:"")).append($.inArray(type, fg2) != -1?"":input).append(after));
              
          elem = setting.find('#'+id);
          if(data.options) {
            var el = data.value;
            if(type!='select') elem.find(input).remove();
            if(type!='select') elem.append($('<div/>',{class:'mdevpb-field-choices'})); 
            $.each( data.options, function ( index, value ) {
              data.id = value;
              data.label = value;
              data.value = value;
              data.checked = value==el ? true:false;
              delete data.options;
              delete data.container_class;
              if(type=='select') elem.find(input).append($('<option/>', {value:data.value, text:data.value}));
              else mdev.pagebuilder(elem.find('.mdevpb-field-choices'), data);
            });

            if(type!='select') elem.find('input').removeAttr('id');
            if(type!='select') elem.find('label').removeAttr('for');

          }

          break;

        case 'fields':     

          var module = mdev.pagebuilder('module','data');
          $.each( data.fields, function ( index, value ) {
            
            if(module[index]&&!data.stop) {

              var fields = {}, 
                  ndata = module[index],
                  nfields = ndata.fields;

              delete ndata.fields;
              ndata.main = true,
              fields[index] = ndata;
              if(nfields) fields = $.extend(fields, nfields);

              data.stop = true;
              data.field = index;
              data.fields = fields;
              mdev.pagebuilder(elem, data);

            }  else {
              
              var fields = {}, mdata = module[index],
                  vdata = $.extend({module:data.module, field:data.field, container_class:data.container_class, for:data.for}, value),
                  cdata = $.extend({class:'design2'}, vdata);

              if(index=='cfz') {
                fields[data.field+"_link"] = $.extend(vdata, {class:'url', label:'Link'});
                fields[data.field+"_color"] = cdata;
                fields[data.field+"_font_size"] = cdata;
                mdev.pagebuilder(elem, {caze:'fields', fields:fields}); 
              } else if(mdata&&!value.main) {
                fields[index] = true;
                mdev.pagebuilder(elem, $.extend({fields:fields, caze:'fields'}, vdata));
              } else mdev.pagebuilder(elem, $.extend({name:index, caze:'field'}, vdata));

            }

          });
          
          break;

        case 'module':

          var module = data.module,
              elem = $('.mdevpb-active'), 
              base = elem.find('.module-base'),
              title = base.find('.module-title'),
              modules = {
                blurb : {
                  modules: ['image','title','content'] 
                },
                image : { 
                  tag : 'img', 
                  label: 'URL', 
                  default : image, 
                  class: 'url imgfld element', 
                  after: '<img src="'+image+'">', 
                  value : base.find('.module-image').attr('src'),
                  fields: {
                    image_link: {class: 'url', label:'Link'},
                    image_width: {class: 'design2'},
                    image_height: {class: 'design2'}, 
                    checkbox1: {switch:true, label:'Use Icon', for:'blurb', class:'xd'}, 
                    icon: {for: 'blurb', container_class:'icnfld'},
                    select1: {label: 'Placement', options:['Top','Left'], for:'blurb', class:'xd'} 
                  } 
                },
                icon : { 
                  tag : 'i', 
                  label: 'class', 
                  class: 'element', 
                  placeholder: 'fa fa-user', 
                  default : 'fa fa-user', 
                  value : base.find('.module-icon').attr('class'),
                  fields: { cfz: true }
                },
                modal : { 
                  modules: ['title','content']
                }, 
                content : { 
                  label: 'Body',
                  class: 'element', 
                  type: 'textarea',
                  value : base.find('.module-content').html(),
                  fields: {
                    cfz: true,
                    checkbox1: {switch:true, label:'Default to Open', for:'toggle', class:'xd'}
                  },
                  default : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.' 
                }, 
                title : {
                  class: 'element',
                  label: 'Text', 
                  default: (module=='modal'?'Label':'Text')+' Here', 
                  value: base.find('.module-title').html(), 
                  tag: module=='modal'?'span':(data.new?(module=='title'?'h2':'h4'):(data.input?$('#heading-field input:checked').val():(title.length?title.prop("tagName").toLowerCase():""))),
                  fields: {
                    heading: {type:'radio', options:headings, class:'xd'}, 
                    cfz: true
                  }
                }, 
                toggle : { 
                  modules: ['title','content'] 
                }
              }; 

          if(data=='data') return modules;
          if(data=='keys') return Object.keys(modules);

          if(!data.input) {

            if(module) $.each( modules[module].modules?modules[module].modules:modules[module], function ( index, field ) {

              var mdls = modules[module].modules, 
                  field = mdls ? field : module,
                  data = { caze:'fields', fields:{} },
                  id = field+"-toggle";

              $('.mdevpb-fields').append($('<div/>', {id:id, class:"temp toggle-module"})
                .append($('<div/>', {class:"module-base"})
                  .append($('<h4/>', {class:"module-title", text:module=='content'?'Text':field}))
                  .append($('<div/>', {class:"module-content"}))
              ));

              data.caze = "fields";
              data.module = module;
              data.fields[field] = true;
              mdev.pagebuilder($('#'+id).find('.module-content'), data);
              mdev.pagebuilder('#'+id, 'input');
              mdev.module('#'+id, 'toggle');

              if(!mdls&&i==1) return false;

            i++; });

            $('.mdevpb-fields').append(setting.find('.default')); 
            mdev.pagebuilder('values', data);

          } 

          if(data.new && module=='modal') {
            var id = '#modal';
            data.title_link = id;
            setting.find('#title_link').val(id);
          }

          base.html("");

          setting.find('#content-link-field').remove();
          setting.find('#heading-field input[value="'+(modules.title.tag)+'"]').prop('checked',true);
          
          setting.find('.element').each(function(){

            var module = $(this).attr('name'), 
                element = modules[module],
                tag = mdev.string(element['tag'], '%s', 'div'), 
                value = data.new ? element['default'] : element['value'], 
                value = module=='icon'&&!data.new&&value ? value.replace("module-icon ", "") : value, 
                value = data.input ? setting.find('#'+module).val() : value, 
                value = module=='image' && !value ? image : value, 
                value = module=='content'&&data.content ? data.content : value, 
                link = setting.find('#'+module+"_link"),
                element = $('<'+tag+'/>', {class:'module-'+module});

            if(!data.input) {
              setting.find('#'+module+'-toggle')
              .show().find('.module-base').addClass('module-open').find('.module-content').show(); 
              link.val(data[module+'_link']);
            }

            if(value) base.append(link.val()?$('<a/>',{href:link.val(), html:element}):element);
            setting.find('#'+module).val(value==image?"":value);

            element = base.find('.module-'+module);
              
            switch(module) {
              case 'image'  : element.attr('src', value); break;
              case 'icon'   : element.attr('class', 'module-icon '+value); break;
              default       : element.html(value.replace(/\n/g, "<br>")); break;
            } if(value) arr[module] = element;

            if(module=='image') 
            setting.find('#image-field img').attr('src', mdev.string(value, image));    
              
          });

          var select1 = setting.find('#select1'), 
              checkbox1 = setting.find('#checkbox1'), 
              title = elem.find('.module-title'),
              icon = elem.find('.module-icon'),
              content = elem.find('.module-content'); 

          switch(module) {

              case 'blurb':

                var imgicn = icon.length ? (data.new?'image':'icon') : 'image', 
                    imgicn = data.input ? (checkbox1.is(':checked') ? 'icon' : 'image') : imgicn, 
                    link = setting.find('#'+imgicn+"_link").val(), 
                    title = setting.find('#title_link').val();

                base.html("")
                  .append(link?$('<a/>', {href:link, html:arr[imgicn]}):arr[imgicn])
                  .append($('<div/>', {class:'module-container'}).append(title?$('<a/>', {href:title, html:arr['title']}):arr['title']).append(arr['content']));

                checkbox1.prop('checked', imgicn=='icon'?true:false);
                imgicn=='icon' ? setting.find('.icnfld').show() : setting.find('.icnfld').hide();

                if(!data.input) select1.val(base.hasClass('module-left')?'Left':'Top');
                select1.val()=='Left' 
                  ? base.addClass('module-left').attr('data-class','left')
                  : base.removeClass('module-left').removeAttr('data-class');

                if(!setting.find('#image').val()&&!data.new) base.find('.module-image').remove();

                break;

              case 'modal':

                setting.find('#heading-field').remove();
                setting.find('#title-link-field').hide();
                setting.find('#title-field label span').text('Label');

                break;

              case 'toggle':

                if(!data.input) 
                checkbox1.prop('checked', base.hasClass('module-open')?true:false);
                checkbox1.is(':checked') 
                  ? base.addClass('module-open').attr('data-class','open')
                  : base.removeClass('module-open').removeAttr('data-class');

                $('#title-link-field').remove();

                break;

          } 
      
          break;

        case 'setting':

          var content = "", 
              toggle = {
                background: {
                  fields: {
                    background_image: {label: 'Image', class: 'url design',  after: '<img src="'+image+'">'},
                    background_color: {label: 'Color', class: 'design'}
                  }
                }, 
                css: {
                  fields: {
                    style: {label: 'Main', class: 'designs', type: 'textarea'},
                    before: {class: 'designs', type: 'textarea'},
                    after: {class: 'designs', type: 'textarea'}
                  }, 
                  toggle_label: 'Custom CSS'
                }, 
                attribute: {
                  toggle_label: 'CSS ID & Classes',
                  fields: {
                    id: {label: 'ID'}, 
                    class: {}
                  }
                }
              };

          $('body').append($('<div/>', {class:'mdevpb-settings mdev'}));
          $('.mdevpb-settings')
            .append($('<a/>', {href:'#', class:'mdevpb-close'})
              .click(function(e){ $(this).parent().hide(); e.preventDefault(); })
              .html($('<i/>', {class:'fa-solid fa-circle-xmark'})))
            .append($('<div/>', {class:'mdevpb-heading', text:'Settings'}))
            .append($('<div/>', {class:'mdevpb-content'})
              .append($('<div/>', {class:'mdevpb-fields'}))
              .append($('<div/>', {class:'mdevpb-structure'}))
              .append($('<div/>', {class:'mdevpb-modules'}))
              .append($('<div/>', {class:'mdevpb-data'}))
            );

          $('.mdevpb-content').children().hide();
          $('.mdevpb-structure').show();

          for (let i = 1; i < 11; i++) {
            var num = i==9 || i==10 ? 3 : i,
                num = i==7 || i==8 ? 2 : num;
            $('.mdevpb-structure').append($('<div/>')
            .attr('data-id', i).click(function(){
              mdev.pagebuilder(this, {caze:'add', structure:true}); 
              $('.mdevpb-settings').hide();
            }));
            for (let x = 0; x < num; x++) {
              var clasz = i==7&&x==0||i==8&&x==1 ? 'column-w33' : "", 
                  clasz = i==7&&x==1||i==8&&x==2 ? 'column-w66' : clasz, 
                  clasz = i==9&&x==1||i==10&&x==0 ? 'column-w60' : clasz, 
                  clasz = i==9&&x==0||i==9&&x==2||i==10&&x==1||i==10&&x==2 ? 'column-w20' : clasz;
              $('.mdevpb-structure [data-id="'+i+'"]').append($('<span/>', {class:clasz}));
            }
          }

          $.each( mdev.pagebuilder('module', 'keys'), function ( index, module ) {

            $('.mdevpb-modules').append($('<div/>', {'data-id':module, html:$('<span/>',{text:module=='content'?'text':module})}).click(function(){
              mdev.pagebuilder(this, {caze:'add', module:module});
              mdev.pagebuilder('module', {module:module, new:true});
              $('.mdevpb-modules').hide();
              $('.mdevpb-fields').show();
            }));
          });
          
          $.each( toggle, function ( index, field ) {

            field.name = index;
            field.caze = 'field';

            $('.mdevpb-fields').append($('<div/>', {id:index+"-toggle", class:"default toggle-module"})
              .append($('<div/>', {class:"module-base"})
                .append($('<h4/>', {class:"module-title", text:mdev.string(field.toggle_label, index)}))
                .append($('<div/>', {class:"module-content"}))
            ));

            el = '#'+index+"-toggle .module-content";
            if(field.fields) $.each( field.fields, function ( index2, field ) {
              field.caze = 'field';
              field.name = field.class&&(field.class).indexOf("design2") >= 0 ? index+"_"+index2 : index2;
              mdev.pagebuilder(el, field);
            });

          });

          mdev.pagebuilder('.mdevpb-fields', 'input');
          mdev.module('.mdevpb-settings');

          $('body').append(
            $('<div/>', {class:'mdevpb-ok'})
            .append($('<button/>', {class:'mdevpb-save', text:'Save'}))
            .append($('<a/>', {href:location, text:'Exit Builder'}))
          );

         $('.mdevpb-save').click(function(){
            
            $('.mdevpb-contents').remove();
            $('body').append($('<div/>', {class:'mdevpb-contents'})
              .append($('<div/>', {class:'mdevpb-content-html', html:$('.mdevpagebuilder').html()}))
              .append($('<textarea/>',{val:'<style type="text/css" class="mdevpb-style">\n\n'+$('.mdevpb-style').html()+'</style>', readonly:true}))
            );

            arr = mdev.pagebuilder('view', 'section');
            content = mdev.pagebuilder('view', {preview:true, arr:arr});
            $('.mdevpb-content-html').replaceWith($('<textarea/>',{val:content+mdev.print(arr), readonly:true}));

          }); break;

        case 'view':

          if(data.preview) {

            html = "";
            $.each( data.arr, function ( index, section ) {
              html += '<section'+mdev.string(section.id, ' id="%s"')+' class="'+section.class+'">\n';
              $.each( section.row, function ( index, row ) {
                html += '  <div'+mdev.string(row.id, ' id="%s"')+' class="'+row.class+'">\n';
                $.each( row.column, function ( index, column ) {
                  html += '    <div'+mdev.string(column.id, ' id="%s"')+' class="'+column.class+'">\n';
                  $.each( column.module, function ( index, content ) {
                    html += '      <div'+mdev.string(content.id, ' id="%s"')+' class="'+content.class+'">\n';
                      html += '        <div class="'+content.base+'">\n';
                      $.each( content.content, function ( index, module ) {
                        var sp1 = index=='title'&&content.container?"  ":"";
                        html += (index=='content'&&content.container?"  ":"")+'          '+(index=='title'&&content.container?'<div class="module-container">\n            ':"")+(module.link?'<a href="'+module.link+'">\n            ':"")+sp1+'<'+module.tag+mdev.string(module.id, ' id="%s"')+mdev.string(module.src, ' src="%s"')+' class="'+module.class+'">';
                        html += module.content;
                        html += (index=='image'?"":'</'+module.tag+'>')+(module.link?'\n          '+sp1+'</a>':"")+(index=='content'&&content.container?'\n          </div>':"")+'\n';
                      }); html += '        </div>\n';
                    html += '      </div>\n';
                  }); html += '    </div>\n';
                }); html += '  </div>\n';
              }); html += '</section>\n';
            }); arr = html;

          } else {

            $('.mdevpb-content-html').find(data).each(function(i){
              var elem = $(this);

              elem.removeClass('ui-sortable');
              elem.removeClass('mdevpb-active');
              elem.removeClass('section');
              arr[i] = {};
              arr[i].id = elem.attr('id');
              arr[i].class = elem.attr('class');
              if(data=='section') arr[i]['row'] = mdev.pagebuilder('view', $('.row', this));
              if(elem.hasClass('row')) arr[i]['column'] = mdev.pagebuilder('view', $('.column', this));
              if(elem.hasClass('column')) arr[i]['module'] = mdev.pagebuilder('view', $('.module', this));
              if(elem.hasClass('module')) {
                arr[i]['content'] = {};
                $.each( ['image','icon','title','content'], function ( index, module ) {
                  index = elem.find('.module-'+module);
                  if(index.length) arr[i]['content'][module] = {
                    id: index.attr('id'), 
                    class: index.attr('class'),
                    content: index.html(),
                    src: index.attr('src'),
                    tag: index.prop("tagName").toLowerCase(), 
                    link: index.parent().attr('href'), 
                    module: module
                  };
                });

                arr[i].base = elem.find('.module-base').attr('class');
                if(elem.find('.module-container').length) arr[i].container = true;

              }

            }); arr = mdev.filter(arr)

          }  return arr;

          break;

        case 'values':

          $('.mdevpb-fields .mdevpb-field').each(function(){
            var field = $(this), 
                name = field.attr('name'),
                value = data[name.replace(/_/g, '-')];
            if(field.is(':checkbox') || field.is(':radio')) field.prop('checked', value?true:false);
            else if(field.is('select')) field.prop("selectedIndex", 0);
            else $(this).val(value); 
            if(name=='background_image')
            setting.find('#background-toggle img').attr('src',value?value:image);
          });  
          
          break;

        case 'default-setting':
          
          setting.find('.mdevpb-content').children().hide();
          setting.find('.mdevpb-fields').removeAttr('data-module');
          setting.find('.temp.toggle-module').remove();
          setting.find('.mdevpb-heading').text(data.module+" Settings");

          mdev.pagebuilder('values', data);

          break;

        case 'default':

          container = $('.'+mdev.get('mdevpagebuilder'))
          container.addClass('mdevpagebuilder');

          $('head').append($('<style/>', {type:"text/css", class:"mdevpb-style", html:'.section-1 { background-color:  #f7f7f7; }'}));
          if(!$('.mdevpagebuilder').text().trim()) $('.mdevpagebuilder').append($('<section/>',{class:'section-1'}));

          mdev.pagebuilder('setting');
          mdev.pagebuilder('elements');
          mdev.pagebuilder('sortable');

          break;

      }

    }

  }

  $(document).ready(function() { 
    
    if(mdev.get('mdevpagebuilder')) mdev.pagebuilder();
    else mdev.module('.content');
    
}); })(jQuery)
