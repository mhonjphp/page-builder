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
      return $('<div/>').addClass(classname+'mdevpb-'+status).html(message);
    },

    module_action: function(el, module) {
      var elem = $(el);
      switch(module) {
        case 'toggle':
          elem.find('.toggle-module .module-title, .toggle-module .mdevpb-handle').click(function(){
            var parent = $(this).parent(), 
                parent = $(this).hasClass('mdevpb-handle') ? parent.find('.module-base') : parent;
            parent.hasClass('module-open') 
              ? parent.removeClass('module-open').find('.module-content').slideUp()
              : parent.addClass('module-open').find('.module-content').slideDown();
          });
          break;
      }
    },

    module: function(el, module='all') {

      if(module=='all') 
      $.each( ['toggle'], function ( index, module ) {
      mdev.module(el, module); });
      else mdev.module_action(el, module);

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
          $('.mdevpb-cancel-sort, .mdevpb-handle').remove();

          container.children().each(function(){
          mdev.pagebuilder(this, 'attribute'); });

          container.find(elems).children().each(function(){
          if(!$(this).parent().hasClass('module')) mdev.pagebuilder(this, 'attribute'); });

          mdev.pagebuilder('data');
          mdev.pagebuilder('css');
          mdev.module('.mdevpagebuilder');
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
              heading = ['h1','h2','h3','h4','h5'], 
              modules = mdev.pagebuilder('module', 'data');

          $('.mdevpb-active').removeClass('mdevpb-active');

          elem.addClass('mdevpb-active');
          data = mdev.pagebuilder('data', '%s'), 

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

            var elem = $('.mdevpb-active'),
                content = elem.find('.module-base'),
                title = elem.find('.module-title');

            if(title.length) {
              title = title.prop("tagName").toLowerCase();
              setting.find('#heading-field input[value="'+title+'"]').prop('checked',true);
            }

            if(data.module=='blurb'&&elem.find('.module-icon').length)
            setting.find('#use_icon').prop('checked', true);

            setting.find('#placement').val(content.hasClass('module-left')?'Left':'Top');

            if($.inArray('content', modules[data.module].elements) != -1
            || data.module=='content') {
              data.content = elem.find('.module-content').html();
              data.content = data.content.replace(/\s\s+/g, "");
              data.content = data.content.replace(/<br>/g, "\n");
           }

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
              elem = $('.mdevpb-active'), 
              i = elem.index()+1;
              index = mdev.pagebuilder(elem, 'index'), 
              data = mdev.pagebuilder('data', '%s'), 
              content = elem.find('.module-container');

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

          arr.id ? elem.attr('id', arr.id) : elem.removeAttr('id');
          arr.class = mdev.string(arr.class, "%s ", "");
          arr.class = data.module ? arr.class+(data.module.replace('content','text'))+"-module " : arr.class;
          elem.attr('class', arr.class+index+"-"+i+" "+index+" mdevpb-active");

          break;

        case 'field':

          var fg1 = ['select', 'textarea'], 
              fg2 = ['checkbox', 'radio'], 
              type = mdev.string(data.type, "text"), 
              type = data.switch ? 'checkbox' : type,
              tag = $.inArray(type, fg1) != -1 ? type : "input",
              id = mdev.string(data.id, data.name), 
              id = (id+"-field").replace(/_/g, '-'),
              clasz = mdev.string(data.class, '%s'),
              span = mdev.string(data.label, data.name), 
              span = clasz.indexOf("design2") >= 0 && !data.label ? span.replace(span.split("_")[0], "") : span,
              label = $('<label/>', {
                for: data.name, 
                class: (data.switch ? "mdevpb-field-switch " : "")+'mdevpb-field-label', 
                append: $('<span/>', {text:mdev.ucwords(span).replace(/_/g, ' ')})
              }), 
              input = $('<'+tag+'/>', {type:type, id:data.name, name:data.name, 
                class: mdev.string(data.class, "%s ")+"mdevpb-field", 
                value: data.value, 
                placeholder: data.placeholder
              }).prop('checked', data.checked),
              after = data.after,  
              field = $('<div/>', {
                id: id, 
                class: mdev.string(data.container_class, "%s ")+(data.for?'mdevpb-for-'+data.for+' mdevpb-none ':"")+'mdevpb-field-'+type+" mdevpb-field-container", 
              });

          elem.append(field.append(label.prepend(data.switch ? $('<span/>', {class:'mdevpb-field-switch-helper'}) : ""))
          .append(input).append(after));

          elem = setting.find('#'+id);
          if($.inArray(type, fg2) != -1) 
          elem.find('label').prepend(input);

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

        case 'module':

          var module = data.module,
              elem = $('.mdevpb-active'), 
              base = elem.find('.module-base'),
              modules = {
                blurb : {
                  elements: ['image','icon','title','content'] },
                content : { 
                  value : base.find('.module-content').html(),
                  default : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.' }, 
                image : { 
                  tag : 'img',
                  default : image, 
                  value : base.find('.module-image').attr('src') },
                title : { 
                  default : 'Title Here', 
                  value : base.find('.module-title').html() }, 
                icon : { 
                  tag : 'i',
                  default : 'fa fa-user', 
                  value : base.find('.module-icon').attr('class') },
                toggle : { 
                  elements: ['title','content'] },
              }; 

          if(data=='data') return modules;
          if(data=='keys') return Object.keys(modules);

          if(data.new) 
          setting.find('#heading-field input[value="'+(module=='title'?'h2':'h4')+'"]').prop('checked',true);

          if(!data.input) {
           setting.find('.toggle-module').hide();
           setting.find('.default').show();
          } 
          
          if(module) {
          
            base.html("");

            $.each( modules[module]&&modules[module]['elements'] 
            ? modules[module]['elements'] : [module], function ( index, module ) {

              var element = modules[module],
                  tag = mdev.string(element['tag'], '%s', 'div'), 
                  tag = module=='title' ? setting.find('#heading-field input:checked').val() : tag,
                  value = data.new ? element['default'] : element['value'], 
                  value = module=='icon'&&!data.new&&value ? value.replace("module-icon ", "") : value, 
                  value = data.input ? setting.find('#'+module).val() : value, 
                  value = module=='image' && !value ? image : value, 
                  value = module=='content'&&data.content ? data.content : value;
              
              if(!data.input) setting.find('#'+module+'-toggle')
                .show().find('.module-base').addClass('module-open').find('.module-content').show(); 
              if(value) base.append($('<'+tag+'/>', {class:'module-'+module}));

              setting.find('#'+module).val(value==image?"":value);
              element = base.find('.module-'+module);
              
              switch(module) {
                case 'image'  : element.attr('src', value); break;
                case 'icon'   : element.attr('class', 'module-icon '+value); break;
                default       : element.html(value.replace(/\n/g, "<br>")); break;
              } if(value) arr[module] = element;
              
              if(data.new && module=='image') setting.find('#image').val("");   
              if(module=='image') setting.find('#image-field img').attr('src', mdev.string(value, image));    
              
            });

            switch(module) {
              case 'blurb':
                var use_icon = setting.find('#use_icon'), 
                    placement = setting.find('#placement');
                base.html("")
                  .append(use_icon.is(':checked') ? arr['icon'] : arr['image'])
                  .append($('<div/>', {class:'module-container'}).append(arr['title']).append(arr['content']));
                use_icon.is(':checked') ? $('.icon-field').show() : $('.icon-field').hide();
                placement.val()=='Left' 
                  ? base.addClass('module-left').attr('data-class', 'module-left')  
                  : base.removeClass('module-left').removeAttr('data-class');
                setting.find('#icon-toggle').hide();
                break;
              case 'toggle':

                var open = setting.find('#open');
                if(data.input) open.is(':checked')  
                    ? base.addClass('module-open').attr('data-class', 'open') 
                    : base.removeClass('module-open').removeAttr('data-class');
                else setting.find('#open').prop('checked', base.data('class')?true:false);
                
                break;

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
                content: {
                  fields: {
                    color: {class:'design'}, 
                    font_size: {class:'design'},
                    open: {switch:true, for:'toggle'}, 
                  },
                  toggle_label: 'Text', 
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
                    use_icon: {switch:true, for:'blurb'}, 
                    placement: {type:'select', options:['Top','Left'], for:'blurb'} 
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

            $('.mdevpb-modules').append($('<div/>', {'data-id':module, html:$('<span/>',{text:module=='content'?'text':module})}).click(function(){
              mdev.pagebuilder(this, {caze:'add', module:module});
              mdev.pagebuilder('module', {module:module, new:true});
              setting.find('#heading-field input[value="'+(module=='title'?'h2':'h4')+'"]').prop('checked',true);
              $('.mdevpb-modules').hide();
              $('.mdevpb-fields').show();
            }));
          });
          
          $.each( fields, function ( index, value ) {

            value.name = index;
            value.caze = 'field';

            $('.mdevpb-fields').append($('<div/>', {id:index+"-toggle", class:mdev.string(value.toggle_class,'%s ')+"toggle-module"})
              .append($('<div/>', {class:"module-base"})
                .append($('<h4/>', {class:"module-title", text:mdev.string(value.toggle_label, index)}))
                .append($('<div/>', {class:"module-content"}))
            ));

            el = '#'+index+"-toggle .module-content";
            if(!value.toggle_class) mdev.pagebuilder(el, value);
            if(value.fields) $.each( value.fields, function ( index2, value ) {
              value.name = index2;
              value.caze = 'field';
              mdev.pagebuilder(el, value);
            });

          });

          $('.mdevpb-fields .mdevpb-field').each(function(){ 
            var action = 
            $(this).is(':checkbox') 
            || $(this).is(':radio') 
            || $(this).is('select') ? 'change' : 'keyup';
            $(this).on(action, function(){ 
              mdev.pagebuilder(this, 'input'); 
            }); 
          });

          mdev.module('.mdevpb-settings', 'toggle');

          $('body').append($('<button/>', {class:'mdevpb-save', text:'Save'}))
          $('.mdevpb-save').click(function(){
            
            $('.mdevpb-contents').remove();
            $('body').append($('<div/>', {class:'mdevpb-contents'})
              .append($('<div/>', {class:'mdevpb-content-html', html:$('.mdevpagebuilder').html()}))
            );



            $.each( $.merge((elems+",.module-base,.module-container").split(","), mdev.pagebuilder('module', 'keys')), function ( index, el ) {
              $('.mdevpb-content-html').find(el!='section'&&el.slice(0,1)!="." ? ".module-"+el:el).each(function(){
                var elem = $(this),  
                    i = elem.index(); 
                    parent = elem.parent(),
                    id = elem.attr('id'), 
                    clasz = elem.attr('class'),
                    src = elem.attr('src'), content = elem.html(),
                    index = mdev.pagebuilder(this, 'index'), 
                    index = el=='.module-base' ? "m-content" : index,
                    index = index ? index : "m-element", 
                    container = parent.hasClass('module-container');  

                $('.mdevpb-cancel-sort, .mdevpb-handle', this).remove();
                elem.removeAttr('id').removeAttr('class').removeAttr('src').removeAttr('data-id').removeAttr('style');

                if(index=='section') {
                  i==0 ? elem.before('@%section') : "";
                  elem.append('@%lb').after('@%lb');
                } else elem.attr('index', index).append('@%'+index);
                
                if(el=='content') {
                  var i = 1, nc = "",
                      content = content.split('<br>');
                  $.each( content, function ( index, value ) {
                  nc += '@%lb@%s6'+(container?"@%s1":"")+value+(i==content.length?"@%lb":"<br>"); i++; });
                  elem.html(nc+'@%s5'+(container?"@%s1":""));
                }

                if(container) elem.attr('space', 1);
                if(el=='.module-base') {
                  elem.attr('class', 'module-base'+mdev.string(clasz, " %s"));
                  elem.removeAttr('data-class');
                }

                elem.attr('id', id);
                elem.attr('src', src);
                elem.attr('class', clasz);
                elem.removeClass('ui-sortable mdevpb-active');
                
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

          break;

        case 'default-setting':
          
       //   setting.find('.module-base').removeClass('open');
          setting.find('.mdevpb-content').children().hide();
          setting.find('.mdevpb-fields').removeAttr('data-module');
          setting.find('#background-toggle img').attr('src', image);
          setting.find('#icon-toggle .module-content').append($('.icon-field').show());
          setting.find('.mdevpb-none.mdevpb-field-container').hide();
          setting.find('.mdevpb-for-'+data.module).show();

          $('.mdevpb-fields .mdevpb-field').each(function(){
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
          break;

      }

    }

  }

  $(document).ready(function() { 
    
    if(mdev.get('mdevpagebuilder')) mdev.pagebuilder();
      
        //  mdev.module('toggle');
    

}); })(jQuery)
