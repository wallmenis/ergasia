console.log("Client-side stuff started!");

//AUTH CODE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let username = "";
let jwtToken;
let loggedin=false;
let jsondata;
let jsonwork;
let jsonlink;

getDataFromApi("works");
getDataFromApi("links");


function LogInPls() {
  jwtToken = "";
  let credentials = {
    username: document.querySelector("[name='fusername']").value,
    password: document.querySelector("[name='fpassword']").value,
  };
  fetch("/login", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(credentials),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json) {
        jwtToken = json;
        username = document.querySelector("[name='fusername']").value;
        document.querySelector("[name='fusername']").value = "";
        document.querySelector("[name='fpassword']").value = "";
        //console.log(document);
        const mainText = document.querySelector("#maintxt");
        mainText.textContent="Logged in as " + username;
        loggedin=true;
      }
    })
    .catch((e) => console.log(e));
}

//UPDATE CODE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function displayLinks()
{
  let links=jsondata;
  const linkDiv=document.querySelector("#Links");
  const linkAsideWiki=document.querySelector("#AsideLinksWiki");
  const linkAsideWorks=document.querySelector("#AsideLinksWorks");
  console.log(linkDiv.children);
  for (let aLink of linkDiv.children)
  {
    linkDiv.removeChild(aLink);
  }
  console.log(linkAsideWiki.children);
  for (let aLink of linkAsideWiki.children)
  {
    linkAsideWiki.removeChild(aLink);
  }
  console.log(linkAsideWorks.children);
  for (let aLink of linkAsideWorks.children)
  {
    linkAsideWorks.removeChild(aLink);
  }
  //console.log(linkDiv)
  for (let aLink of links)
  {
    //console.log(aLink.id);
    //console.log(aLink.name);
    //console.log(aLink.urlthing);
    let aLinkIsle = document.createElement("div");
    aLinkIsle.classList.add("islandthing");
    let aLinkUrl = document.createElement("a");
    aLinkUrl.href = aLink.urlthing;
    aLinkUrl.textContent = aLink.name;
    aLinkIsle.appendChild(aLinkUrl);
    linkDiv.appendChild(aLinkIsle);
    
  }
  //console.log(links);
  
}

function displayLinksManagement()
{

}

function displayWorks()
{
  
}

function displayWorksManagement()
{
  
  let works=jsondata;
  const worksDiv=document.querySelector("#Works");
  for (let aWork of works)
  {
    let aWorkIsle = document.createElement("div");
    aWorkIsle.classList.add("islandthing");
    let titleHead = document.createElement("h5");
    titleHead.textContent=aWork.name;
    let descriptionBody = document.createElement("div");
    descriptionBody.textContent=aWork.description;
    let dateBody = document.createElement("div");
    dateBody.textContent=aWork.date;
    aWorkIsle.appendChild(titleHead);
    aWorkIsle.appendChild(descriptionBody);
    aWorkIsle.appendChild(dateBody);
    worksDiv.appendChild(aWorkIsle);
  }
  console.log(works);
}

//HIDING AND SHOWING
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function hideWith(thing) {
  const asideSection = document.querySelectorAll(thing);
  for (const anElement of asideSection) {
    anElement.classList.add("hidden");
  }
}

function showWith(thing) {
  const asideSection = document.querySelectorAll(thing);
  for (const anElement of asideSection) {
    anElement.classList.remove("hidden");
  }
}

function showAnything(selection) {
  hideWith(".AsideText");
  hideWith("#Works");
  hideWith("#Biography");
  hideWith("#Pictures");
  hideWith("#Links");
  //console.log(selection);
  //const asideSection = document.querySelector(selection);
  //asideSection.classList.remove("hidden");
  showWith(selection);
  const managlinks = document.querySelector("#manageLinks");
  managlinks.classList.add("hidden");
  const managworks = document.querySelector("#manageWorks");
  managworks.classList.add("hidden");
  const logg = document.querySelector("#login");
  logg.classList.add("hidden");
  const maintxt = document.querySelector("#maintxt");
  maintxt.classList.add("hidden");

  if(selection===".Biography")
  {
    showWith("#Biography");
  }
  else if(selection===".Works")
  {
    showWith("#Works");
  }
  else if(selection===".Pictures")
  {
    showWith("#Pictures");
  }
  else if(selection===".Links")
  {
    showWith("#Links");
  }
  
}

function showManagement() {
  hideWith(".AsideText");
  hideWith("#Works");
  hideWith("#Biography");
  hideWith("#Pictures");
  hideWith("#Links");
  const asideSection = document.querySelector(".management");
  asideSection.classList.remove("hidden");
  const errorthing = document.querySelector("#maintxt");
  errorthing.textContent="Please log in.";
  errorthing.classList.remove("hidden");
  if(loggedin)
  {
    errorthing.textContent="Logged in as " + username;
  }
}

function showWithIdPls(idofthing, requiresAuth)
{
  hideWith("#login");
  hideWith("#manageWorks");
  hideWith("#manageLinks");
  const errorthing = document.querySelector("#maintxt");
  if(requiresAuth && !loggedin)
  {
    errorthing.textContent="You need to be logged in to access that.";
  }
  else
  {
    errorthing.textContent="Please log in.";
    if(loggedin)
    {
      errorthing.textContent="Logged in as " + username;
    }
    const logg = document.querySelector("#"+idofthing);
    logg.classList.remove("hidden");
  }
}

function DisconnectPls()
{
  showWithIdPls("login",false);
  const errorthing = document.querySelector("#maintxt");
  errorthing.textContent="Please log in.";
  jwtToken="";
  loggedin=false;
}

function incId(inputthing)
{
  getDataFromApi(inputthing);
  console.log(jsondata);
  return 1;
}

function UpdateJsonPls(inputthing)
{
  jsondata=inputthing;
}

//CRUD
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getFormDataWork() {
  let aWork = {
      id: document.querySelector("#worksForm [name='fworkid']").value,
      name: document.querySelector("#worksForm [name='fname']").value,
      description: document.querySelector("#worksForm [name='fworkdescription']").value,
      date: document.querySelector("#worksForm [name='fdate']").value,
  };
  console.log(aWork);
  return JSON.stringify(aWork);
}

function getFormDataLink() {
  let aLink = {
      id: document.querySelector("#linksForm [name='flinkid']").value,
      name: document.querySelector("#linksForm [name='fnamelink']").value,
      urlthing: document.querySelector("#linksForm [name='flink']").value,
      type: document.querySelector("#linksForm [name='flinktype']").value,
  };
  
  return JSON.stringify(aLink);
}

function getFormWrapper(inputthing)
{
  console.log("From Wrapper: "+inputthing);
  if(inputthing==="works")
  {
    return getFormDataWork();
  }
  return getFormDataLink();
}

function getDataFromApi(inputthing) {
  fetch("/api/"+inputthing, {
     /*headers: {
        Authorization: `Bearer ${jwtToken}`
     },*/
     method: "GET" 
    })
    .then((res) => res.json())
    .then((json) => {
      console.log((json));
      UpdateJsonPls((json));
      if(inputthing==="works")
      {
        displayWorks();
        displayWorksManagement();
      }
      if(inputthing==="links")
      {
        displayLinks();
        displayLinksManagement();
      }
    })
    .catch((err) => console.error("error:", err));
}

function addDataToApi(inputthing) {
  let bodyData = getFormWrapper(inputthing);
  console.log("bodyData: "+bodyData);
  fetch("/api/" + inputthing, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => {
      res.json();
    })
    .then((json) => {
      alert(json);
      getDataFromApi(inputthing);
    })
    .catch((err) => {
      alert("error:", err);
      console.log(err);
    });
}

function updateThing(inputthing) {
  let bodyData = getFormWrapper(inputthing);
  fetch("/api/"+inputthing+"/" + bodyData.id, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getDataFromApi(inputthing);
    })
    .catch((err) => alert("error:", err));
}

function deleteThing(inputthing) {
  let bodyData = getFormWrapper(inputthing);
  fetch("/api/" + inputthing + "/" + bodyData.id, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getDataFromApi(inputthing);
    })
    .catch((err) => alert("error:", err));
}
