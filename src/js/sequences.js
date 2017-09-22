console.log("Sequences");
function showRadialTree(url) {
    if(url.includes('https')){
        url=url.replace('https://','');
      }else{
        url=url.replace('http://','');
      }
      
      var pos=url.indexOf('/');
      if(pos!=-1) url=url.substring(0,pos);
      
      var xhr = new XMLHttpRequest();
      xhr.open("GET","https://web.archive.org/cdx/search/cdx?url="+url+"/&fl=timestamp,original&matchType=prefix&filter=statuscode:200&filter=mimetype:text/html&output=json", true);       
      xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);
        
        var paths_arr=new Array();
        var j=0;
        for(var i=1;i<response.length;i++){
          var url=response[i][1].toLowerCase();
          if(url.includes('jpg') || url.includes('pdf') || url.includes('png') || url.includes('form') || url.includes('gif')){
            continue;
          }
          if(url.startsWith('https')){
            url=url.replace('https','http');
          }
          if(response[i][1].indexOf(':80')>(-1)){
            url=response[i][1].replace(':80','');
          }
          
          if(url.includes('www1')){
            url=url.replace('www1','www');
          }else if(url.includes('www2')){
            url=url.replace('www2','www');
          }else if(url.includes('www3')){
            url=url.replace('www3','www');
          }else if(url.includes('www0')){
              url=url.replace('www0','www');
          }

          if(url.indexOf('://www')==(-1)){
            url="http://www."+url.substring(7);
          }
          
          var format=/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
          var n=0;
          while(format.test(url.charAt(url.length-1))){
            n++;
            url = url.substring(0, url.length -1);
          }
          
          if(url.charAt(url.length-1)!='/'){
            if(url.charAt(url.length-2)!='/'){
              url=url+'/';
            }else{
              url = url.substring(0, url.length -1);
            }
          }

          if(url.includes('%0a')){
            url.replace('%0a','');
          }
          
          if(url.slice(-2)=='//'){
            url = url.substring(0, url.length -1);
          }
          if(url.includes(',')){
            url=url.replace(/,/g ,'');
          }
          
          response[i][1]=url;
          if(i==1){
            
            paths_arr[0]=new Array();
            paths_arr[0].push(response[1]);
            
          }else if(response[i-1][1]==response[i][1]){
            
            paths_arr[j].push(response[i]);
            
          }else{
            j++;
            paths_arr[j]=new Array();
            paths_arr[j].push(response[i]);
          }
        }
        
        var year_arr=new Array();
        for(var i=0;i<paths_arr.length;i++){
          
          year_arr[i]=new Array();
          for(var j=0;j<paths_arr[i].length;j++){
            if(j==0){
              year_arr[i].push(paths_arr[i][j][1]);
              var date=paths_arr[i][j][0].slice(0,4);
              year_arr[i].push(date);
              
            }else if(paths_arr[i][j-1][0].slice(0,4)!=paths_arr[i][j][0].slice(0,4)){
              year_arr[i].push(paths_arr[i][j][0].slice(0,4));
            }
          }
        }
        
        var years=new Array();
        
        for(var i=1;i<year_arr[0].length;i++){
          years[i-1]=new Array();
          
          years[i-1].push(year_arr[0][i]);
          
        }
         
        for(var i=0;i<year_arr.length;i++){
          var url=year_arr[i][0];
          for(var j=1;j<year_arr[i].length;j++){
            var date=year_arr[i][j];
            var k=0;
            if(years[k]!=undefined){
              while(years[k]!=undefined && years[k][0]!=date){
                k++;
              }
              if(years[k]!=undefined){
                years[k].push(url);
              }
            }
          }
        }
        
        for(var i=0;i<years.length;i++){
          for(var j=1;j<years[i].length;j++){
            var url;
            if(years[i][j].includes('http')){
              url=years[i][j].substring(7);
              
            }else if(years[i][j].includes('https')){
              url=years[i][j].substring(8);
            }
            url=url.slice(0,-1);
            if(url.includes('//')){
              url=url.split('//').join('/');
            }
            url=url.split('/').join('>');
            years[i][j]=url;
          }
        }
        var all_years=[];
        for(var i=0;i<years.length;i++){
          if(years[i].length>1){
            all_years.push(years[i][0]);
          }
        }

        function make_new_text(n){
          var text="";
          var x=2;
          if(years[n].length==2){
            x=1;
          }
          
          for(var i=x;i<years[n].length;i++){
            if(i!=(years[n].length-1)){
              text=text+years[n][i]+">end,1"+"\n";
            }else{
              text=text+years[n][i]+">end,1";
            }
          }
          return text;
          
        }  
        
        var divBtn=document.getElementById('divBtn');  
        if(document.getElementsByClassName('yearbtn').length==0){
          for(var i=0;i<all_years.length;i++){
            var btn=document.createElement('button');
            btn.setAttribute('class','yearbtn');
            btn.setAttribute('id',all_years[i]);
            btn.innerHTML=all_years[i];
            btn.onclick=highlightBtn;
            divBtn.appendChild(btn);
          }
        }
        
        
        function highlightBtn(eventObj){
          var target=eventObj.target;
          if(document.getElementsByClassName('activebtn').length!=0){
            
            document.getElementsByClassName('activebtn')[0].classList.remove('activebtn') ;
          }
          target.classList.add('activebtn');
          IAglobvar=target.id;
          var num=all_years.indexOf(target.id);
          var text=make_new_text(num);
          make_chart(text);
        }
        var btns=document.getElementsByClassName('yearbtn');
        if(document.getElementsByClassName('activebtn').length!=0){
          
          var actId=document.getElementsByClassName('activebtn')[0].id;
          var index=all_years.indexOf(actId);
          IAglobvar=actId;
          var text=make_new_text(index);
          make_chart(text);
          
          
        }else{
          btns[0].classList.add('activebtn');
          IAglobvar= document.getElementsByClassName('activebtn')[0].id;
          var text=make_new_text(0);
          make_chart(text);
        }
        
        function make_chart(text){
          document.getElementById('sequence').innerHTML="";
          document.getElementById('chart').innerHTML="";
          document.getElementById('message').innerHTML="";
          var width = window.innerWidth-150;
          var height = window.innerHeight-150;
          var radius = Math.min(width, height) / 2;
          
          var b = {
            w: 100, h: 30, s: 3, t: 10
          };
          
          var colors=d3.scaleOrdinal(d3.schemeCategory20b);
          
          var totalSize = 0; 
          
          var vis = d3.select("#chart").append("svg:svg")
          .attr("width", width)
          .attr("height", height)
          .append("svg:g")
          .attr("id", "container")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
          
          var partition = d3.partition()
          .size([2 * Math.PI, radius * radius]);
          
          var arc = d3.arc()
          .startAngle(function(d) { return d.x0; })
          .endAngle(function(d) { return d.x1; })
          .innerRadius(function(d) { return Math.sqrt(d.y0); })
          .outerRadius(function(d) { return Math.sqrt(d.y1); });
          
          var csv = d3.csvParseRows(text);
          var json = buildHierarchy(csv);
          console.log(json);
          createVisualization(json);
          
          function createVisualization(json) {
            vis.append("svg:circle")
            .attr("r", radius)
            .style("opacity", 0);
            
            var root = d3.hierarchy(json)
            .sum(function(d) { return d.size; })
            .sort(function(a, b) { return b.value - a.value; });
            
            var nodes = partition(root).descendants()
            var path = vis.data([json]).selectAll("path")
            .data(nodes)
            .enter().append("svg:path")
            .attr("display", function(d) { return d.depth ? null : "none"; })
            .attr("d", arc)
            .attr("fill-rule", "evenodd")
            .style("fill", function(d) { 
              if(d.data.name=='end'){return '#000000';}
              else{
                return colors((d.children ? d : d.parent).data.name); 
              }
            }).style("opacity", 1)
            .on("mouseover", mouseover)
            .on("click",openTheUrl);
            d3.select("#container").on("mouseleave", mouseleave);
            
            totalSize = path.datum().value;
          };
          
          
          function openTheUrl(d){
            var year=IAglobvar;
            var anc=d.ancestors().reverse();
            var url="";
            for(var i=1;i<anc.length;i++){
              if(anc[i].data.name=='end'){
                break;
              }
              url=url+'/'+anc[i].data.name;
            }
            // var wb_url="https://web.archive.org/web/"+year+"*";
            //   chrome.runtime.sendMessage({message:'openurl',wayback_url: wb_url,page_url:url});
          }
          
          function mouseover(d) {
            var percentage = (100 * d.value / totalSize).toPrecision(3);
            var percentageString = percentage + "%";
            if (percentage < 0.1) {
              percentageString = "< 0.1%";
            }
            
            d3.select("#percentage").text(percentageString);
            
            var sequenceArray = d.ancestors().reverse();
            sequenceArray.shift(); 
            updateBreadcrumbs(sequenceArray, percentageString);
            
            d3.selectAll("path")
            .style("opacity", 0.3);
            
            vis.selectAll("path")
            .filter(function(node) {
              return (sequenceArray.indexOf(node) >= 0);
            })
            .style("opacity", 1);
          }
          
          function mouseleave(d) {
            document.getElementById("sequence").innerHTML="";
            d3.selectAll("path").on("mouseover", null);
            
            d3.selectAll("path")
            .transition()
            
            .style("opacity", 1)
            .on("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });
          }
          
          function breadcrumbPoints(d, i) {
            var points = [];
            points.push("0,0");
            points.push(b.w + ",0");
            points.push(b.w + b.t + "," + (b.h / 2));
            points.push(b.w + "," + b.h);
            points.push("0," + b.h);
            if (i > 0) {
            points.push(b.t + "," + (b.h / 2));
          }
          return points.join(" ");
        }
        
        function stash(d) {
          d.x0 = d.x;
          d.dx0 = d.dx;
        }
        
        function updateBreadcrumbs(nodeArray, percentageString) {
          var anc_arr=nodeArray;
          var trail = document.getElementById("sequence");
          var text="";
          var symb=document.createElement('span');
          symb.setAttribute('class','symb');
          symb.innerHTML=">";
          for(var i=0;i<anc_arr.length;i++){
            if(i==0){
              text=" "+anc_arr[i].data.name;
            }else{
              text=text+symb.innerHTML+anc_arr[i].data.name;
            }
            
          }
          trail.innerHTML=text;
        }
        
        function drawLegend() {
          var li = {
            w: 75, h: 30, s: 3, r: 3
          };
          
          var legend = d3.select("#legend").append("svg:svg")
          .attr("width", li.w)
          .attr("height", d3.keys(colors).length * (li.h + li.s));
          
          var g = legend.selectAll("g")
          .data(d3.entries(colors))
          .enter().append("svg:g")
          .attr("transform", function(d, i) {
            return "translate(0," + i * (li.h + li.s) + ")";
          });
          
          g.append("svg:rect")
          .attr("rx", li.r)
          .attr("ry", li.r)
          .attr("width", li.w)
          .attr("height", li.h)
          .style("fill", function(d) { return d.value; });
          
          g.append("svg:text")
          .attr("x", li.w / 2)
          .attr("y", li.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.key; });
        }
        
        function toggleLegend() {
          var legend = d3.select("#legend");
          if (legend.style("visibility") == "hidden") {
            legend.style("visibility", "");
          } else {
            legend.style("visibility", "hidden");
          }
        }
        function buildHierarchy(csv) {
          var length=csv.length;
          var root = {"name": "root", "children": []};
          for (var i = 0; i < length; i++) {
            var sequence = csv[i][0];
            var size = +csv[i][1];
            if (isNaN(size)) { // e.g. if this is a header row
              continue;
            }
            var parts = sequence.split(">");
            var currentNode = root;
            for (var j = 0; j < parts.length; j++) {
              var children = currentNode["children"];
              var nodeName = parts[j];
              var childNode;
              if (j + 1< parts.length) {
                // Not yet at the end of the sequence; move down the tree.
                var foundChild = false;
                for (var k = 0; k < children.length; k++) {
                  if (children[k]["name"] == nodeName) {
                    childNode = children[k];
                    foundChild = true;
                    break;
                  }
                }
                // If we don't already have a child node for this branch, create it.
                if (!foundChild) {
                  childNode = {"name": nodeName, "children": []};
                  children.push(childNode);
                }
                currentNode = childNode;
              } else {
                // Reached the end of the sequence; create a leaf node.
                childNode = {"name": nodeName, "size": size};
                children.push(childNode);
              }
            }
          }
          return root;
        }; 
      }
    };
    xhr.send();
}