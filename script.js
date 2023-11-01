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
      return JSON.stringify(arr,null,'\t').replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;&nbsp;'); 
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
          string += index+a+(b==";\n"?" ":"")+value+b; 
        } else {
          value = value.split(b);
          index = value[0].trim();
          if(value[0]&&value[1]) arr1[index] = value[1].trim();
        }
      }); return object ? string : arr1;

    },

    notice: function(message, status='success', classname="") {
      var classname = classname ? classname+" " : "";
      return $('<div/>').addClass(classname+'mdev'+status).html(message);
    },

    module: function(el, caze) {
      var elem = $(el)
      switch(caze) {
        case 'toggle':
          elem.each(function(){
          $(this).find('.toggle-title').click(function(){
            var parent = $(this).parent();
            parent.hasClass('open') 
              ? parent.removeClass('open').find('.toggle-content').slideUp()
              : parent.addClass('open').find('.toggle-content').slideDown();
          }); });
          break;

      }

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
          image = location+"assets/no-image.jpg"; 

      switch(caze) {

        case 'button':

          var index = mdev.pagebuilder(elem.parents(), 'index'),
              index = index=='column' ? 'module' : index, 
              index = data.single ? mdev.string(data.index, 'module') : index, 
              action = data.single ? 'add' : data.action, 
              clasz = data.single ? 'xsort mdevpb-add-'+index+' mdevpb-single ' : "";

          elem.append($('<button/>', {
            class: clasz+'mdevpb-'+action, 
            onclick: "mdev.pagebuilder(this, '"+action+"');",
            title: mdev.ucwords(action+' '+index)
          }));

          break;

        case 'action':
          index = mdev.pagebuilder(elem, 'index'),
          elem.append($('<div/>', {class:'mdev'+index+'-action mdevpb-action xsort'}));
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
              remove = ["mdevactive", "ui-sortable-handle", "ui-sortable"], 
              modules = mdev.pagebuilder('module', 'keys');

          $.each( elem.attr('class').split(" "), function ( key, classname ) {
            var cn = classname.split('-'), 
                classname = data.attribute ? classname : classname.replace('column-w', "").replace('mdevmodule-temp', ""), 
                clasz = $.inArray(classname, remove) == -1 ? true : "";
                clasz = $.inArray(classname.replace("-module", ""), modules) == -1
                || data.attribute ? clasz : "";
                clasz = cn[0]==index && $.isNumeric(cn[1]) ? "" : clasz;
                clasz = $.isNumeric(classname) ? "" : clasz;
                clasz = classname==index ? "" : clasz;
          if(clasz) classes += classname+" "; });
          return classes.trim();
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
              id = $('.mdevactive').data('id');
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
                if(value.indexOf(".")||value.indexOf(":") >= 0) {
                  var value = value.indexOf(":") >= 0 
                        ? (value.indexOf(":before") >= 0 ? ':before':':after') : " "+value;
                      value = value.slice(1), 
                      key = index.replace(value, "").slice(0, -1);
                  if(!arr[key]) arr[key] = {};
                  arr[key][value] = arr[index];
                  delete arr[index];
                }
              });
            }); 
          }

          if(mdev.isobject(el)) 
          json[id] = $.extend(json[id], el);

          container.find(elems).each(function(){

            var module = "", 
                elem = $(this), 
                id = elem.data('id');

            $.each( mdev.pagebuilder('module', 'keys'), function(index, id){
            if(elem.hasClass(id+'-module')) module = id; });

            datas[id] = $.extend(mdev.filter({
              id      : elem.attr('id'), 
              class   : mdev.pagebuilder(this, 'classes'), 
              design  : (html ? (json[id]?json[id]['design']:"") : arr[mdev.pagebuilder(this, 'class')]),
              module  : module, 
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
                $('.mdevactive').removeClass('mdevactive');
              }, cancel:".xsort", handle: '.mdevpb-handle', 
              connectWith: (index=='section' ? "section" : (index=='column' ? ".column" : ""))
            });
          });

          break;

        case 'css':

          var style = "";
          $.each( mdev.pagebuilder('data'), function(index, value){
            var clasz = mdev.pagebuilder('[data-id="'+index+'"]', 'class');
            if(value.design) {
              var design = mdev.strobject(value.design, ": ", ";\n");
              if(design) style += clasz+" {\n"+design+"}\n\n";
              $.each( value.design, function(index, value){
                if(mdev.isobject(value)) {
                  index = $.inArray(index, ['before','after']) != -1 ? ":"+index : " "+index;
                  style += clasz+index+" {\n"+mdev.strobject(value, ": ", ";\n")+"}\n\n";
                }
              });
            } }); $('.mdevpb-style').html(style);


          break;

        case 'elements':

          container = $('.'+mdev.get('mdevpagebuilder'));
          $('.xsort, .mdevpb-handle').remove();

          container.children().each(function(){
          mdev.pagebuilder(this, 'attribute'); });

          container.find(elems).children().each(function(){
          if(!$(this).parent().hasClass('module')) mdev.pagebuilder(this, 'attribute'); });

          mdev.pagebuilder('data');
          mdev.pagebuilder('css');

          break;

        case 'element':

          var index = mdev.pagebuilder(el, 'index'),
              element = index=='section'?'section':'div';

          return $('<'+element+'/>', {class:index+" mdevtemp"}); 

          break;

        case 'add':

          var rowdule = data.structure, 
              rowdule = data.module ? data.module : rowdule
              parent = elem.parents(':eq(1)'), 
              parent = rowdule ? $('.mdevactive') : parent, 
              parent = elem.hasClass('mdevpb-single') ? elem : parent, 
              index = mdev.pagebuilder(parent, 'index'), 
              index = elem.hasClass('mdevpb-single') ? (elem.hasClass('mdevpb-add-row')?'row':'module') : index,
              index = rowdule ? 'section' : index,
              section = mdev.pagebuilder(parent, 'element'),
              element = $('<div/>', {class:'row mdevtemp'}).html($('<div/>', {class:'column'})), 
              element = data.module ? $('<div/>', {class:elem.data('id')+'-module module mdevmodule-temp'}).html($('<div/>', {class:'module-content'})) : element;

          $('.mdevactive').removeClass('mdevactive');
          mdev.pagebuilder('default-setting', {module: data.module});

          if(index=='section') {

            parent.after(rowdule ? element : section);
            if( data.structure ) {
              var i = elem.data('id'),
                  num = i==9 || i==10 ? 3 : i,
                  num = i==7 || i==8 ? 2 : num;
              $('.row.mdevtemp').html("");
              for (let x = 0; x < num; x++) {
                var clasz = i==7&&x==0||i==8&&x==1 ? 'column-w33' : "", 
                    clasz = i==7&&x==1||i==8&&x==2 ? 'column-w66' : clasz, 
                    clasz = i==9&&x==1||i==10&&x==0 ? 'column-w60' : clasz, 
                    clasz = i==9&&x==0||i==9&&x==2||i==10&&x==1||i==10&&x==2 ? 'column-w20' : clasz;
                $('.row.mdevtemp').append($('<div/>', {class:clasz}).addClass('column'));
              }
            }  
          
            rowdule ? "" : $('section.mdevtemp').html(element);
            $('.mdevtemp').removeClass('mdevtemp');
            data.module ? $('.mdevmodule-temp').parent().find('.mdevpb-single').remove() : "";
            mdev.pagebuilder('elements');
            data.module ? $('.mdevmodule-temp').addClass('mdevactive').removeClass('mdevmodule-temp') : "";

          } else {

            setting.find('.toggle').removeClass('open');
            setting.find('.mdevpb-content').children().hide();
            setting.fadeIn().find(index=='row'?'.mdevpb-structure':'.mdevpb-modules').show();
            setting.find('.mdevpb-heading').text('Insert '+index);
            parent.addClass('mdevactive');

          }
            
          break;

        case 'edit':

          var style = "", title = "",
              elem = elem.parents(':eq(1)'), 
              index = mdev.pagebuilder(elem, 'index'),
              heading = ['h1','h2','h3','h4','h5'];

          $('.mdevactive').removeClass('mdevactive');

          elem.addClass('mdevactive');
          data = mdev.pagebuilder('data', '%s');

          $.each( data, function ( index, value ) {

            if(mdev.isobject(value))
            $.each( value, function ( index, value ) {

              var field = setting.find('[name="'+index.replace(/-/g, '_')+'"]'), 
                  value = index=='background-image' ? value.slice(4, -1) : value;
                
              if(mdev.isobject(value)) {
                arr[index] = mdev.strobject(value, ":", ";\n");

                $.each( value, function ( index1, value ) {
                  index = $.inArray(index, heading) != -1 ? 'heading' : index;
                  arr[index+"-"+index1] = value; 
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
          mdev.pagebuilder('default-setting', arr);
          setting.fadeIn().find('.mdevpb-fields').show();
          setting.find('.mdevpb-heading').text(mdev.string(data.module, index)+" Settings");

          if(data.module) {

            var elem = $('.mdevactive'),
                content = elem.find('.module-content'),
                title = elem.find('.module-title');

            if(title.length)
            setting.find('#heading-field input[value="'+title.prop("tagName").toLowerCase()+'"]').prop('checked',true);

            if(data.module=='blurb'&&elem.find('.module-icon').length)
            setting.find('#use_icon').prop('checked', true);

            setting.find('#placement').val(content.hasClass('module-left')?'Left':'Top');

            data.text = elem.find('.module-text').html();
            data.text = data.text.replace(/\s\s+/g, "");
            data.text = data.text.replace(/<br>/g, "\n");

          }  mdev.pagebuilder('module', data);

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

          var design = {}, arr2 = {},
              elem = $('.mdevactive'), 
              i = elem.index()+1;
              index = mdev.pagebuilder(elem, 'index'), 
              data = mdev.pagebuilder('data', '%s'), 
              content = elem.find('.module-container');

          setting.find('#background-toggle img').attr('src', image);

          $('.mdevpb-fields .mdevfield').each(function(){
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
                arr2[name.split("_")[0]] = el;
              } else if(field.hasClass('designs')) {
                if(name=='style') design = $.extend(design, mdev.strobject(value, ";", ":")); 
                else design[name] =  mdev.strobject(value, ";", ":");
              } else arr[name] = value.replace(/</g, ""); 
            }
            
            if(field.hasClass('element')) 
             mdev.pagebuilder('module', {input:true, module:data.module});

          });

          $.each( arr2, function ( index, value ) {
            var arr3 = {};
            $('.mdevpb-fields .design2').each(function(){
              if($(this).val()) {
                var name = $(this).attr('name'), 
                    el = name.split("_")[0], 
                    key = name.replace(el+"_", "");
              if(index==el) arr3[key.replace(/_/g, '-')] = $(this).val().replace(/</g, ""); }
              
            }); design[index] = arr3;
          });

          if(data.module=='title'||data.module=='blurb') 
          design[setting.find('#heading-field input:checked').val()] = design.heading;
        
          delete arr.heading;
          delete arr.placement;
          delete arr.use_icon;
          delete design.heading;

          arr.design = design; 
          mdev.pagebuilder(arr, 'data');
          mdev.pagebuilder('css');

          console.log(arr);

          arr.id ? elem.attr('id', arr.id) : elem.removeAttr('id');
          arr.class = mdev.string(arr.class, "%s ", "");
          arr.class = data.module ? arr.class+data.module+"-module " : arr.class;
          elem.attr('class', arr.class+index+"-"+i+" "+index+" mdevactive");

          break;

        case 'field':

          var fg1 = ['select', 'textarea'], 
              fg2 = ['checkbox', 'radio'], 
              type = mdev.string(data.type, "text"), 
              tag = $.inArray(type, fg1) != -1 ? type : "input",
              id = mdev.string(data.id, data.name), 
              id = (id+"-field").replace(/_/g, '-'),
              clasz = mdev.string(data.class, '%s'),
              span = mdev.string(data.label, data.name), 
              span = clasz.indexOf("design2") >= 0 && !data.label ? span.replace(span.split("_")[0], "") : span,
              label = $('<label/>', {
                for: data.name, 
                class: (data.switch ? "mdevpbfield-switch " : "")+'mdevpbfield-label', 
                append: $('<span/>', {text:mdev.ucwords(span).replace(/_/g, ' ')})
              }), 
              input = $('<'+tag+'/>', {type:type, id:data.name, name:data.name, 
                class: mdev.string(data.class, "%s ")+"mdevfield", 
                value: data.value, 
                placeholder: data.placeholder
              }).prop('checked', data.checked),
              after = data.after,  
              field = $('<div/>', {
                id: id, 
                class: mdev.string(data.container_class, "%s ")+'mdevpbfield-'+type+" mdevpbfield-container", 
              });

          elem.append(field.append(label.prepend(data.switch ? $('<span/>', {class:'mdevpbfield-switch-helper'}) : ""))
          .append(input).append(after));

          elem = setting.find('#'+id);
          if($.inArray(type, fg2) != -1) 
          elem.find('label').prepend(input);

          if(data.options) {
            var el = data.value;
            if(type!='select') elem.find(input).remove();
            if(type!='select') elem.append($('<div/>',{class:'mdevpbfield-choices'})); 
            $.each( data.options, function ( index, value ) {
              data.id = value;
              data.label = value;
              data.value = value;
              data.checked = value==el ? true:false;
              delete data.options;
              delete data.container_class;
              if(type=='select') elem.find(input).append($('<option/>', {value:data.value, text:data.value}));
              else mdev.pagebuilder(elem.find('.mdevpbfield-choices'), data);
            });
            if(type!='select') elem.find('input').removeAttr('id');
            if(type!='select') elem.find('label').removeAttr('for');
          }

          break;

        case 'module':

          var elem = $('.mdevactive'), 
              content = elem.find('.module-content'),
              modules = {
                blurb : {
                  elements: ['image','icon','title','text'] },
                text : { 
                  value : content.find('.module-text').html(),
                  default : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.' }, 
                image : { 
                  tag : 'img',
                  default : image, 
                  value : content.find('.module-image').attr('src') },
                title : { 
                  tag : 'h1',
                  default : 'Title Here', 
                  value : content.find('.module-title').html() }, 
                icon : { 
                  tag : 'i',
                  default : 'fa fa-user', 
                  value : content.find('.module-icon').attr('class') },
              }; 

          if(data=='data') return modules;
          if(data=='keys') return Object.keys(modules);

          if(data.new) 
          setting.find('#heading-field input[value="'+(data.module=='blurb'?'h4':'h2')+'"]').prop('checked',true);

          if(!data.input) {
           setting.find('.toggle').hide();
           setting.find('.default').show();
          } 

          if(data.module) {
          
            content.html("");

            $.each( modules[data.module]&&modules[data.module]['elements'] 
            ? modules[data.module]['elements'] : [data.module], function ( index, module ) {

              var element = modules[module],
                  tag = mdev.string(element['tag'], '%s', 'div'), 
                  tag = module=='title' ? setting.find('#heading-field input:checked').val() : tag,
                  value = data.new ? element['default'] : element['value'], 
                  value = module=='icon'&&!data.new&&value ? value.replace("module-icon ", "") : value, 
                  value = data.input ? setting.find('#'+module).val() : value, 
                  value = module=='image' && !value ? image : value, 
                  value = module=='text'&&data.text ? data.text : value;
              
              if(!data.input) setting.find('#'+module+'-toggle').show().addClass('open'); 
              if(value) content.append($('<'+tag+'/>', {class:'module-'+module}));

              setting.find('#'+module).val(value==image?"":value);
              element = content.find('.module-'+module);
              
              switch(module) {
                case 'image'  : element.attr('src', value); break;
                case 'icon'   : element.attr('class', 'module-icon '+value); break;
                default       : element.html(value.replace(/\n/g, "<br>")); break;
              } if(value) arr[module] = element;
              
              if(data.new && module=='image') setting.find('#image').val("");   
              if(module=='image') setting.find('#image-field img').attr('src', mdev.string(value, image));    
              
            });
        
            if(data.module=='blurb') {
              var use_icon = setting.find('#use_icon'), 
                  placement = setting.find('#placement');
              content.html("")
                .append(use_icon.is(':checked') ? arr['icon'] : arr['image'])
                .append($('<div/>', {class:'module-container'}).append(arr['title']).append(arr['text']));
              use_icon.is(':checked') ? $('.icon-field').show() : $('.icon-field').hide();
              placement.val()=='Left' ? content.addClass('module-left') : content.removeClass('module-left');
              setting.find('#icon-toggle').hide();
            }

          }

          break;

        case 'setting':

          var headings = ['h1','h2','h3','h4','h5','h6'], 
              fields = {
                title: {
                  fields : {
                    heading: {type:'radio', options:headings}, 
                    heading_color: {class:'design2'}, 
                    heading_font_size: {class:'design2'}
                  },
                  label: 'Text', 
                  class: 'element'
                },
                text: {
                  fields: {
                    color: {class:'design'}, 
                    font_size: {class:'design'}
                  },
                  label: 'Content',
                  class: 'element', 
                  type: 'textarea'
                },
                image: { 
                  label: 'URL', 
                  class: 'url element', 
                  after: '<img src="'+image+'">', 
                  fields: {
                    img_width: {class:'design2'}, img_height: {class:'design2'}, 
                    use_icon: {type:'checkbox', switch:true, container_class:'mdevpb-blurb mdevpb-none'}, 
                    placement: {type:'select', options:['Top','Left'], container_class:'mdevpb-blurb mdevpb-none'} 
                  }
                }, 
                icon: {
                  fields: {
                    i_color: {class:'design2', container_class:'icon-field'}, 
                    i_font_size: {class:'design2', label:'Size', container_class:'icon-field'}
                  },
                  label: 'class', 
                  placeholder: 'fa fa-user', 
                  class: 'element', 
                  container_class: 'icon-field'
                },
                background: {
                  fields: {
                    background_image: {label: 'Image', class: 'url design',  after: '<img src="'+image+'">'},
                    background_color: {label: 'Color', class: 'design'}
                  }, 
                  toggle_class: 'default'
                }, 
                css: {
                  fields: {
                    style: {label: 'Main', class: 'designs', type: 'textarea'},
                    before: {class: 'designs', type: 'textarea'},
                    after: {class: 'designs', type: 'textarea'}
                  }, 
                  toggle_label: 'Custom CSS',
                  toggle_class: 'default'
                }, 
                attribute: {
                  toggle_label: 'CSS ID & Classes', 
                  toggle_class: 'default',
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
            $('.mdevpb-modules').append($('<div/>', {'data-id':module, html:$('<span/>',{text:module})}).click(function(){
              mdev.pagebuilder(this, {caze:'add', module:module});
              mdev.pagebuilder('module', {module:module, new:true});
              $('.mdevpb-modules').hide();
              $('.mdevpb-fields').show();
            }));
          });
          
          $.each( fields, function ( index, value ) {

            value.name = index;
            value.caze = 'field';

            $('.mdevpb-fields').append($('<div/>', {id:index+"-toggle", class:mdev.string(value.toggle_class,'%s ')+"toggle"})
              .append($('<div/>', {class:"toggle-title", text:mdev.string(value.toggle_label, index)}))
              .append($('<div/>', {class:"toggle-content"}))
            );

            el = '#'+index+"-toggle .toggle-content";
            if(!value.toggle_class) mdev.pagebuilder(el, value);
            if(value.fields) $.each( value.fields, function ( index2, value ) {
              value.name = index2;
              value.caze = 'field';
              mdev.pagebuilder(el, value);
            });

          });


          $('body').append($('<button/>', {class:'mdevpb-save', text:'Save'}))
          $('.mdevpb-save').click(function(){
            
            $('.mdevpb-contents').remove();
            $('body').append($('<div/>', {class:'mdevpb-contents'})
              .append($('<div/>', {class:'mdevpb-content-html', html:$('.mdevpagebuilder').html()}))
            );

            $.each( $.merge((elems+",.module-content,.module-container").split(","), mdev.pagebuilder('module', 'keys')), function ( index, el ) {
              $('.mdevpb-content-html').find(el!='section'&&el.slice(0,1)!="." ? ".module-"+el:el).each(function(){
                var elem = $(this),  i = elem.index(); parent = elem.parent(),
                    id = elem.attr('id'), clasz = elem.attr('class'),
                    src = elem.attr('src'), content = elem.html(),
                    index = mdev.pagebuilder(this, 'index'), 
                    index = el=='.module-content' ? "m-content" : index,
                    index = index ? index : "m-element", 
                    container = parent.hasClass('module-container');  
  
                $('.xsort, .mdevpb-handle', this).remove();
                elem.removeAttr('id').removeAttr('class').removeAttr('src').removeAttr('data-id');
                
                if(index=='section') {
                  i==0 ? elem.before('@%section') : "";
                  elem.append('@%lb').after('@%lb');
                } else elem.attr('index', index).append('@%'+index);
                
                if(el=='text') {
                  var i = 1, nc = "",
                      content = content.split('<br>');
                  $.each( content, function ( index, value ) {
                  nc += '@%lb@%s6'+(container?"@%s1":"")+value+(i==content.length?"@%lb":"<br>"); i++; });
                  elem.html(nc+'@%s5'+(container?"@%s1":""));
                }

                if(container) elem.attr('space', 1);

                elem.attr('id', id);
                elem.attr('src', src);
                elem.attr('class', clasz);
                elem.removeClass('ui-sortable mdevactive');
                
              });

            });

            content = $('.mdevpb-content-html').html();
            content = content.split('@%section')[1];
            content = content.replace(/\n/g, "");
            content = content.replace(/\s\s+/g, "");

            $.each( ['row','column','module','m-content','m-element'], function ( index, elem ) {
              var string1 = '<div index="'+elem+'"', 
                  string2= '@%'+elem+'</div>', 
                  regExp1 = new RegExp(string1,'g'), 
                  regExp2 = new RegExp(string2,'g'), 
                  space = elem=='row'?"  ":"          ";
                  space = elem=='column'?"    ":space,
                  space = elem=='module'?"      ":space,
                  space = elem=='m-content'?"        ":space;
              content = content.replace(regExp1, '\n'+space+'<div');
              content = content.replace(regExp2, '\n'+space+'</div>');
            });
            
            $.each( $.merge(headings, ['i','img']), function ( index, element ) {
              var regExp1 = new RegExp('<'+element+' index="m-element"','g'), 
                  regExp2 = new RegExp('@%m-element</'+element+'>','g'), 
                  regExp3 = new RegExp('<'+element+' space="1"','g');
              content = content.replace(regExp1, '\n          <'+element);
              content = content.replace(regExp2, '</'+element+'>');
              content = content.replace(regExp3, '  <'+element);
            });

            content = content.replace(/@%lb/g, '\n');
            content = content.replace(/@%s6/g, "            ");
            content = content.replace(/@%s5/g, "          ");
            content = content.replace(/@%s1/g, "  ");
            content = content.replace(/<div space="1"/g, "  <div");

            $('.mdevpb-content-html').replaceWith($('<textarea/>',{val:content, readonly:true}));

          });

          $('.mdevpb-fields .mdevfield').each(function(){ 
            var action = 
            $(this).is(':checkbox') 
            || $(this).is(':radio') 
            || $(this).is('select') ? 'change' : 'keyup';
            $(this).on(action, function(){ 
              mdev.pagebuilder(this, 'input'); 
            }); 
          });

          break;

        case 'default-setting':
          
          setting.find('.toggle').removeClass('open');
          setting.find('.mdevpb-content').children().hide();
          setting.find('.mdevpb-fields').removeAttr('data-module');
          setting.find('#background-toggle img').attr('src', image);
          setting.find('#icon-toggle .toggle-content').append($('.icon-field').show());
          setting.find('.mdevpb-none.mdevpbfield-container').hide();
          setting.find('.mdevpb-'+data.module).show();

          $('.mdevpb-fields .mdevfield').each(function(){
            var field = $(this), 
                name = field.attr('name'),
                value = data[name.replace(/_/g, '-')];
            if(field.is(':checkbox') || field.is(':radio'))
              field.prop('checked', false);
            else if(field.is('select')) field.prop("selectedIndex", 0);
            else $(this).val(value); 
          });  

          if(data.module) {

            if(data.module=='blurb') 
            setting.find('#use-icon-field').after($('.icon-field').hide());
            setting.find('.mdevpb-fields').attr('data-module', data.module);
            setting.find('.mdevpb-heading').text(data.module+" Settings");

          }

          break;

        case 'default':

          container = $('.'+mdev.get('mdevpagebuilder'))
          container.addClass('mdevpagebuilder');

          $('head').append($('<style/>', {type:"text/css", class:"mdevpb-style"}));
          if(!$('.mdevpagebuilder').text().trim()) $('.mdevpagebuilder').append($('<section/>',{class:'section-1'}));

          mdev.pagebuilder('setting');
          mdev.pagebuilder('elements');
          mdev.pagebuilder('sortable');
          mdev.module('.toggle', 'toggle');

          break;

      }

    }

  }

  $(document).ready(function() { 
    
    if(mdev.get('mdevpagebuilder')) mdev.pagebuilder();


}); })(jQuery)
