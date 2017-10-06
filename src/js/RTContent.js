
function displayRTContent() {
    if (window.top !== window) return;
    
    if (document.getElementById("myModal") != null) {
        document.getElementById("myModal").remove();
    }
    
    var modal=document.createElement('div');
    modal.setAttribute('id','myModal');
    modal.setAttribute('class','RTmodal');
    
    var modalContent=document.createElement('div');
    modalContent.setAttribute('class','modal-content');
    var span=document.createElement('button');
    var divBtn=document.createElement('div');
    divBtn.setAttribute('id','divBtn');
    var message=document.createElement('div');
    message.setAttribute('id','message');
    
    span.innerHTML='&times';
    span.setAttribute('class','RTclose');

    var main=document.createElement('div');
    var sequence=document.createElement('div');
    var chart=document.createElement('div');
    sequence.setAttribute('id','sequence');
    chart.setAttribute('id','chart');
    main.setAttribute('id','main');
    
    modal.appendChild(divBtn);
    modal.appendChild(span);
    modal.appendChild(sequence);
    modal.appendChild(chart);
    modal.appendChild(message);
    document.body.appendChild(modal);
    
    modal.style.display = "block";
       
    span.onclick = function() {
        modal.style.display = "none";
    }
}
