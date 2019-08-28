let storage = localStorage;
let json = '';
let content  = {
  data:[]
};

const tableBody = document.querySelector('.info tbody');
const rtForm = document.getElementById('route');
const rtSubmit = document.querySelector('#route button');

$('.r_error').hide();
$('.close').click(function(){
  $(this).parent().hide();
});

// Storage cheker
function checkStorage(key){
    let checkData = JSON.parse(storage.getItem(key));
    if (checkData !== null && checkData.length !== 0 ){
        content.data = checkData;
        tableBody.innerHTML = content.intoTable(JSON.parse(content.get('info')));
    }
}
// Route submiting.
rtSubmit.addEventListener('click', (e)=>{
  e.preventDefault();
  let rtFormData = [...rtForm].filter((x)=>x.value!='');
  let arrivalCalc = (time, minsToAdd) => {
    let zeroBefore = (h)=>{ return (h<10?'0':'')+h;};
    let split = time.split(':');
    let minutes = split[0]*60 + +split[1] + +minsToAdd;
    return `${zeroBefore(minutes%(24*60)/60 | 0)}:${zeroBefore(minutes%60)}`;  
  } 
  if (rtFormData.length === 4){
    let dataObj = {};
    let arrivalTime  = arrivalCalc(rtFormData[0].value, rtFormData[1].value);
    
    for (item of rtFormData){
      if (item.name == 'duration'){
        dataObj['arrival'] = arrivalTime;
      }else{
        dataObj[item.name] = item.value;
      }  
    }
    content.data.push(dataObj);
    content.add('info', JSON.stringify(content.data));
    tableBody.innerHTML = content.intoTable(JSON.parse(content.get('info')));
    rtForm.reset();
  }else{
    $('.r_error').show();
  }
});

// Add data content to storage
content.add = (key, obj)=>{
    storage.setItem(key,obj);
};
// Get data from storage by key
content.get = (key)=>{
    return storage.getItem(key);
};
// Write data content from storage to table
content.intoTable = (array)=>{
  let info = '';
  for (let row of array){
    info += '<tr>';
    for(let item in row){
      if (item === 'price'){
            if (isNaN(parseInt(row[item]))) {row[item] = 0}
          row[item] = `₼ <b>${row[item]}</b> (buy)`;
        }
      info += `<td>${row[item]}</td>`;
    }
    info += '</tr>';
  }
  return info
};
// Clear content from storage
content.clear = ()=>{
    storage.clear();
};

checkStorage('info');