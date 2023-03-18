import _, { isLength } from 'lodash';

import { DomElement } from 'TkbbFolder/dom/html.js';
import  * as Daos from 'TkbbFolder/daos.js';

import { registerButtonFunction } from 'TkbbFolder/dom/html.js';

// import { registerFormFunction } from 'TkbbFolder/dom/html.js';

import { RunMatrix } from 'TkbbFolder/eventbuttons/box1/button-matrix.js';
import { RunCCMatrix } from 'TkbbFolder/eventbuttons/box1/button-ccmatrix.js';
import { RunFirewall } from 'TkbbFolder/eventbuttons/b-firewall.js';
import { ShowAdrRelation } from 'TkbbFolder/eventbuttons/b-d3fwAddresses.js';
// import { RunAlert2 } from 'TkbbFolder/boxbuttons/box1/testalerts.js';
import { RunTable } from 'TkbbFolder/eventbuttons/box1/button-table.js';
import { RunAnalyse } from 'TkbbFolder/eventbuttons/box1/button-analyse.js';
// import { RunForm } from 'TkbbFolder/boxbuttons/box1/buttonsb1Submit.js';
// import { FB1Button1 } from 'TkbbFolder/boxbuttons/box1/buttonsb1b1.js';
// import { FB2Button1 } from 'TkbbFolder/boxbuttons/box2/buttonsb2b1.js';
// import { FB3Button1 } from 'TkbbFolder/boxbuttons/box3/buttonsb3b1.js';

const Adresse = [
  {
    name: 'Joerg',
    vorname: 'Kebbedies',
  },
  {
    name: 'Jürgen',
    vorname: 'Schmidt',
  }
]

// Beispiele mit Funktionen 
// var vorname = "Joerg"
// var n = vorname + " "+ ((par) => {return "Kebbedies "+par;})("Hallo")
// console.log("Ausgabe:", n)


function mainPage() {
  const element = document.createElement('main');
  // element.innerHTML = _.join(['DAoS', 'AuthorityGUI', 'from', 'TrustKBB Domain'], ' ');
  element.classList.add('mainclass');
  element.id = 'main';
  return element;
}

function registerForm() {
  'use strict'
  const forms = document.querySelectorAll('.requires-validation')
  console.log(forms)
  Array.from(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  }

function createForm1(targetID) {
    const formBody = new DomElement({ targetid: targetID, ownid: 'fb', type: 'div' })
      formBody.addClass('form-body')
    
    const formrow = new DomElement({ targetid: 'fb', ownid: 'frow', type: 'div' })
      formrow.addClass('row')
    
    const formHolder = new DomElement({ targetid: 'frow', ownid: 'fh', type: 'div' })
      formHolder.addClass('form-holder')
    
    const formContent = new DomElement({ targetid: 'fh', ownid: 'fc', type: 'div' })
      formContent.addClass('form-content')
    // FormItems
    const formItems = new DomElement({ targetid: 'fc', ownid: 'fitms', type: 'div' })
      formItems.addClass('form-items')
    
    // // H3
    // const formh3=new DomElement({ targetid: 'fitms', ownid: 'ih3', type: 'h3' })
    // formh3.addContent("Register Today")
    // //P
    // const formp1=new DomElement({ targetid: 'fitms', ownid: 'ip1', type: 'p' })
    // formp1.addContent("Fill in the data below")  
    
    // Open Form
    const Form01 = new DomElement({ targetid: 'fitms', ownid: 'form1', type: 'form' })
    // // Form01.addAttribute('action','http://localhost:8080/adressen')
    Form01.addAttribute('novalidate','')
    Form01.addClass('requires-validation')
      
    // Username  
      const colMD12_1 = new DomElement({ targetid: 'form1', ownid: 'cmd12-1', type: 'div' })
      colMD12_1.addClass('col-md-12')
      
        const IName = new DomElement({ targetid: 'cmd12-1', ownid: 'iname', type: 'input' })
        IName.addClass('form-control')
        IName.addAttribute('type','text')
        IName.addAttribute('name','name')
        IName.addAttribute('placeholder','Full Name')
        IName.addAttribute('required','')
    
        const valFeedBackName = new DomElement({ targetid: 'cmd12-1', ownid: 'vfb', type: 'div' })
        valFeedBackName.addClass('valid-feedback')
        valFeedBackName.addContent('Username field is valid')
    
        const invalFeedBackName = new DomElement({ targetid: 'cmd12-1', ownid: 'ivfb', type: 'div' })
        invalFeedBackName.addClass('invalid-feedback')
        invalFeedBackName.addContent('Username field cannot be blank')
      
      // Open E-Mail
      const colMD12_2 = new DomElement({ targetid: 'form1', ownid: 'cmd12-2', type: 'div' })
        colMD12_2.addClass('col-md-12')
  
        const IEmail = new DomElement({ targetid: 'cmd12-2', ownid: 'iemail', type: 'input' })
          IEmail.addClass('form-control')
          IEmail.addAttribute('name','email')
          IEmail.addAttribute('type','text')
          IEmail.addAttribute('name','email')
          IEmail.addAttribute('placeholder','E-Mail Address')
          IEmail.addAttribute('required','')
  
        const valFeedBackEmail = new DomElement({ targetid: 'cmd12-2', ownid: 'vfb2', type: 'div' })
          valFeedBackEmail.addClass('valid-feedback')
          valFeedBackEmail.addContent('E-Mail field is valid')
  
        const invalFeedBackEmail = new DomElement({ targetid: 'cmd12-2', ownid: 'ivfb2', type: 'div' })
          invalFeedBackEmail.addClass('invalid-feedback')
          invalFeedBackEmail.addContent('E-Mail field cannot be blank')
  
      // Open Position  
      const colMD12_3 = new DomElement({ targetid: 'form1', ownid: 'cmd12-3', type: 'div' })
        colMD12_3.addClass('col-md-12')
  
        const Selection = new DomElement({ targetid: 'cmd12-3', ownid: 'sel1', type: 'select' })
          Selection.addClass('form-select')
          Selection.addClass('mt-3')
          
          const Opt1 = new DomElement({ targetid: 'sel1', ownid: 'opt1', type: 'option' })
            Opt1.addAttribute('selected','')
            Opt1.addAttribute('disabled','')
            Opt1.addAttribute('value',"")
            Opt1.addContent('Position')
          
          const Opt2 = new DomElement({ targetid: 'sel1', ownid: 'opt2', type: 'option' })
            Opt2.addAttribute('value','jweb')
            Opt2.addContent('Junior Web Developer')
          
          const Opt3 = new DomElement({ targetid: 'sel1', ownid: 'opt3', type: 'option' })
            Opt3.addAttribute('value','sweb')
            Opt3.addContent('Senior Web Developer')
          
          const Opt4 = new DomElement({ targetid: 'sel1', ownid: 'opt4', type: 'option' })
            Opt4.addAttribute('value','pmanager')
            Opt4.addContent('Project Manager')
          // Valdid Position Selection
          
          const valFeedBackPos = new DomElement({ targetid: 'cmd12-3', ownid: 'vfbpos', type: 'div' })
            valFeedBackPos.addClass('valid-feedback')
          // InValid Position Selection
          const invalFeedBackPos = new DomElement({ targetid: 'cmd12-3', ownid: 'invfbpos', type: 'div' })
            invalFeedBackPos.addClass('invalid-feedback')
          
      // Password
      const colMD12_4 = new DomElement({ targetid: 'form1', ownid: 'cmd12-4', type: 'div' })
        colMD12_4.addClass('col-md-12')
        // Input Password 
        const IPassw = new DomElement({ targetid: 'cmd12-4', ownid: 'ipassw', type: 'input' })
          IPassw.addClass('form-control')
          IPassw.addAttribute('type','password')
          IPassw.addAttribute('name','password')
          IPassw.addAttribute('placeholder','Password')
          IPassw.addAttribute('required','')
  
        const valFeedBackPassw = new DomElement({ targetid: 'cmd12-4', ownid: 'vfbp', type: 'div' })
          valFeedBackPassw.addClass('valid-feedback')
          valFeedBackPassw.addContent('Password field is valid')
  
        const invalFeedBackPassw = new DomElement({ targetid: 'cmd12-4', ownid: 'ivfbp', type: 'div' })
          invalFeedBackPassw.addClass('invalid-feedback')
          invalFeedBackPassw.addContent('Password field cannot be blank')
      
      //Gender
      const colMD12_5 = new DomElement({ targetid: 'form1', ownid: 'cmd12-5', type: 'div' })
        colMD12_5.addClass('col-md-12')
        colMD12_5.addClass('mt3')
        const LGender = new DomElement({ targetid: 'cmd12-5', ownid: 'lgender', type: 'label' })  
          LGender.addAttribute('for','gender')
          LGender.addContent('Gender')
       
         // Male-Input   
         const Imale = new DomElement({ targetid: 'cmd12-5', ownid: 'male', type: 'input' })
           Imale.addClass('btn-check')
           Imale.addAttribute('type','radio')
           Imale.addAttribute('name','gender')
           Imale.addAttribute('autocomlete','off')
           Imale.addAttribute('required','')
         // Male-Label
         const Lmale = new DomElement({ targetid: 'cmd12-5', ownid: 'lmale', type: 'label' })  
           Lmale.addClass('btn')
           Lmale.addClass('btn-sm')
           Lmale.addClass('btn-outline-secondary')
           Lmale.addAttribute('for','male')
           Lmale.addContent('Male')
         // Female-Input   
         const Ifemale = new DomElement({ targetid: 'cmd12-5', ownid: 'female', type: 'input' })
           Ifemale.addClass('btn-check')
           Ifemale.addAttribute('type','radio')
           Ifemale.addAttribute('name','gender')
           Ifemale.addAttribute('autocomlete','off')
           Ifemale.addAttribute('required','')
         // Feale-Label
         const Lfemale = new DomElement({ targetid: 'cmd12-5', ownid: 'lfemale', type: 'label' })  
           Lfemale.addClass('btn')
           Lfemale.addClass('btn-sm')
           Lfemale.addClass('btn-outline-secondary')
           Lfemale.addAttribute('for','female')
           Lfemale.addContent('Female')
         // Secret-Input   
         const Isecret = new DomElement({ targetid: 'cmd12-5', ownid: 'secret', type: 'input' })
           Isecret.addClass('btn-check')
           Isecret.addAttribute('type','radio')
           Isecret.addAttribute('name','gender')
           Isecret.addAttribute('autocomlete','off')
           Isecret.addAttribute('required','')
         // Secret-Label
         const Lsecret = new DomElement({ targetid: 'cmd12-5', ownid: 'lsecret', type: 'label' })  
           Lsecret.addClass('btn')
           Lsecret.addClass('btn-sm')
           Lsecret.addClass('btn-outline-secondary')
           Lsecret.addAttribute('for','secret')
           Lsecret.addContent('Secret')
  
           const valGender = new DomElement({ targetid: 'cmd12-5', ownid: 'vgen', type: 'div' })
             valGender.addClass('valid-feedback')
             valGender.addClass('mv-up')
             valGender.addContent('You selected a gender')
   
           const invalGender = new DomElement({ targetid: 'cmd12-5', ownid: 'ivgen', type: 'div' })
             invalGender.addClass('invalid-feedback')
             invalGender.addClass('mv-up')
             invalGender.addContent('Please select a gender')
      // Formcheck
      const formcheck = new DomElement({ targetid: 'form1', ownid: 'fcheck', type: 'div' })
        formcheck.addClass('formcheck')
        // Input   
        const Ifcheck = new DomElement({ targetid: 'fcheck', ownid: 'invalidCheck', type: 'input' })
          Ifcheck.addClass('form-check-input')
          Ifcheck.addAttribute('type','checkbox')
          Ifcheck.addAttribute('required','')
        // Label
        const Lfcheck = new DomElement({ targetid: 'fcheck', ownid: 'lfcheck', type: 'label' })  
          Lfcheck.addClass('form-check-label')
          Lfcheck.addAttribute('for','secret')
          Lfcheck.addContent('I confirm that all data are correct!')
        
        const formbutton = new DomElement({ targetid: 'form1', ownid: 'fbutton', type: 'div' })
          formbutton.addClass('form-button')
          formbutton.addClass('mt3')  
        const SButton = new DomElement({ targetid: 'fbutton', ownid: 'submit', type: 'button' })
          SButton.addAttribute ('Type','submit') 
          SButton.addClass ('btn') 
          SButton.addClass ('btn-primary') 
          SButton.addContent ('Register') 
  
        // registerForm()
        }

function createNavBar(targetID){
    const Nav = new DomElement({ targetid: targetID, ownid: 'navid', type: 'nav' })
              // Nav-Bar
      Nav.addClass('navbar')
      Nav.addClass('navbar-expand-lg')
      // Nav.addClass('fixed-top')
                    
        
            // Brand-ID to Nav-Bar
            const Brand = new DomElement({ targetid: 'navid', ownid: 'brandid', type: 'a' })
              Brand.addClass('navbar-brand')
              Brand.addAttribute('href','#')
              Brand.addContent('Haeckerküchen')
            
            const BrandBtn = new DomElement({ targetid: 'navid', ownid: 'brandbtnid', type: 'button' })
              BrandBtn.addClass('navbar-toggler')
              BrandBtn.addClass('navbar-dark')
              BrandBtn.addAttribute('type','button')
              BrandBtn.addAttribute('data-toggle','collapse')
              BrandBtn.addAttribute('data-target','#content-navigation')
              BrandBtn.addAttribute('data-controls','content-navigation')
              BrandBtn.addAttribute('aria-expanded','false')
              BrandBtn.addAttribute('aria-label','Toogle navigation')
              
              // <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
         
            const BtnSpan = new DomElement({ targetid: 'brandbtnid', ownid: 'btnspnid', type: 'span' })
                BtnSpan.addClass('navbar-toggler-icon')
        
            const MainNav = new DomElement({ targetid: 'navid', ownid: 'content-navigation', type: 'div' })
              MainNav.addClass('collapse')
              MainNav.addClass('navbar-collapse')
                 
              // Nav-List to Nav-Bar
            const MainNavList = new DomElement({ targetid: 'content-navigation', ownid: 'navlistid', type: 'ul' })
              // horizontal
              MainNavList.addClass('navbar-nav')
              MainNavList.addClass('mr-auto')
             
              
                const ListItem1 = new DomElement({ targetid: 'navlistid', ownid: 'item1id', type: 'li' })
                ListItem1.addClass('nav-item')
                ListItem1.addClass('dropdown')
                const ListItem1Link = new DomElement({ targetid: 'item1id', ownid: 'itemlink1', type: 'a' })
                  ListItem1Link.addClass('nav-link')
                  ListItem1Link.addClass('dropdown-toggle')
                  ListItem1Link.addAttribute('href','#')
                  ListItem1Link.addAttribute('role','button')
                  ListItem1Link.addAttribute('data-bs-toggle','dropdown')
                  ListItem1Link.addContent('Feature')

                const ListItem1Drop = new DomElement({ targetid: 'item1id', ownid: 'link1droplist', type: 'ul' })
                  ListItem1Drop.addClass('dropdown-menu')
                  ListItem1Drop.addAttribute('aria-labelledby','itemlink1')
                 
                // Function Matrix
                // const ListDropItem1 = new DomElement({ targetid: 'link1droplist', ownid: 'itemdrop1id', type: 'li' })
                //   const DropItem1 = new DomElement({ targetid: 'itemdrop1id', ownid: 'matrixButton', type: 'button' })
                //     DropItem1.addClass('dropdown-item') 
                //     // DropItem1.addAttribute('href','#')
                //     DropItem1.addAttribute('type','button')
                //     DropItem1.addContent('Matrix')
                  
                //   // Function Table
                // const ListDropItem2 = new DomElement({ targetid: 'link1droplist', ownid: 'itemdrop2id', type: 'li' })
                //   const DropItem2 = new DomElement({ targetid: 'itemdrop2id', ownid: 'tableButton', type: 'button' })
                //     DropItem2.addClass('dropdown-item') 
                //     // DropItem2.addAttribute('href','#')
                //     DropItem2.addAttribute('type','button')
                //     // DropItem2.addAttribute('onclick',RunAlert())
                //     DropItem2.addContent('Table')
                
                //     // Function Analyse
                // const ListDropItem3 = new DomElement({ targetid: 'link1droplist', ownid: 'itemdrop3id', type: 'li' })                 
                //   const DropItem3 = new DomElement({ targetid: 'itemdrop3id', ownid: 'analyseButton', type: 'button' })
                //     DropItem3.addClass('dropdown-item') 
                //     // DropItem2.addAttribute('href','#')
                //     DropItem3.addAttribute('type','button')
                //     // DropItem2.addAttribute('onclick',RunAlert())
                //     DropItem3.addContent('Analyse')
                //     // Function Analyse
                // const ListDropItem4 = new DomElement({ targetid: 'link1droplist', ownid: 'itemdrop4id', type: 'li' })                 
                //   const DropItem4 = new DomElement({ targetid: 'itemdrop4id', ownid: 'ccButton', type: 'button' })
                //     DropItem4.addClass('dropdown-item') 
                //     // DropItem2.addAttribute('href','#')
                //     DropItem4.addAttribute('type','button')
                //     // DropItem2.addAttribute('onclick',RunAlert())
                //     DropItem4.addContent('CC-Matrix')
                const ListDropItem5 = new DomElement({ targetid: 'link1droplist', ownid: 'itemdrop5id', type: 'li' })                 
                  const DropItem5 = new DomElement({ targetid: 'itemdrop5id', ownid: 'fwButton', type: 'button' })
                    DropItem5.addClass('dropdown-item') 
                    // DropItem2.addAttribute('href','#')
                    DropItem5.addAttribute('type','button')
                    // DropItem2.addAttribute('onclick',RunAlert())
                    DropItem5.addContent('Firewall')
                const ListDropItem6 = new DomElement({ targetid: 'link1droplist', ownid: 'itemdrop6id', type: 'li' })                 
                  const DropItem6 = new DomElement({ targetid: 'itemdrop6id', ownid: 'd3Button', type: 'button' })
                    DropItem6.addClass('dropdown-item') 
                    // DropItem2.addAttribute('href','#')
                    DropItem6.addAttribute('type','button')
                    // DropItem2.addAttribute('onclick',RunAlert())
                    DropItem6.addContent('D3-Firewall')
                  
                
                const ListItem2 = new DomElement({ targetid: 'navlistid', ownid: 'item2id', type: 'li' })
                ListItem2.addClass('nav-item')
                const ListItem2Link = new DomElement({ targetid: 'item2id', ownid: 'itemlink2', type: 'a' })
                  ListItem2Link.addClass('nav-link')
                  ListItem2Link.addAttribute('href','about.html')
                  ListItem2Link.addContent('About')
            
                const ListItem3 = new DomElement({ targetid: 'navlistid', ownid: 'item3id', type: 'li' })
                ListItem3.addClass('nav-item')
                const ListItem3Link = new DomElement({ targetid: 'item3id', ownid: 'itemlink3', type: 'a' })
                  ListItem3Link.addClass('nav-link')
                  ListItem3Link.addAttribute('href','contact.html')
                  ListItem3Link.addContent('Contact')                

                } 
                                 
function createHTML() {

  // document.body.appendChild(mainPage());
  createNavBar('main')
      
  const mainContainer = new DomElement({ targetid: 'main', ownid: 'mainContainer', type: 'div' })
    mainContainer.addClass('container-fluid')
    // mainContainer.addClass('container')
        
    // Display Area  
    const DisplayPage = new DomElement({ targetid: 'mainContainer', ownid: 'displayRow', type: 'div' })
    DisplayPage.addClass('row')
    
    // Content Area
    const RoomPage = new DomElement({ targetid: 'mainContainer', ownid: 'roomRow', type: 'div' })
      RoomPage.addClass('row')
      // RoomPage.addClass('align-items-center')
    
    // ADD LEFT Display-Windows
    const Left = new DomElement({ targetid: 'roomRow', ownid: 'leftid', type: 'div' })
      Left.addClass('d-flex')
      Left.addClass('leftframe')      
      Left.addClass('flex-column')
      Left.addClass('justify-content-center')
      
      Left.addClass('col-8')
      Left.addClass('bg-primary')
      Left.addClass('text-white')
    
      //Linke Seite in NAV und CONTENT aufteilen
      const ContentBox = new DomElement({ targetid: 'leftid', ownid: 'contentBox', type: 'div' })
      ContentBox.addClass('boxContent')
        
    // ADD RIGHT Windows
    const Right = new DomElement({ targetid: 'roomRow', ownid: 'rightid', type: 'div' })
      Right.addClass('right')
      Right.addClass('col-4')
      Right.addClass('bg-info')
      Right.addClass('text-white')
      // Right.addContent('Right')
    const FormBox = new DomElement({ targetid: 'rightid', ownid: 'detailBox', type: 'div' })
      FormBox.addClass('boxDetail')
           
                 
    // createForm1('rightid');
    // registerForm()
  
}

// Ereignisse

// Feature Table
$('button#tableButton').on("click",() => {
  console.log("Table pressed")
  var tableHeader = ['ID', 'Description'];
  RunTable(tableHeader)
})

// Feature Matrix
$('button#matrixButton').on("click",() => {
  RunMatrix()
})

// Feature Analyse
$('button#analyseButton').on("click",() => {
  RunAnalyse()
})

// Feature CC-Matrix
$('button#ccButton').on("click",() => {
  RunCCMatrix()
})

// Feature Firewall Data
$('button#fwButton').on("click",() => {
  RunFirewall()
})
// Feature Firewall Data
$('button#d3Button').on("click",() => {
  
  var targets = [
    {
      adr: "192.168.100.200",
      net: "trust"
    },
    {
      adr: "192.168.2.100",
      net: "untrust"
    },
    {
      adr: "192.168.10.150",
      net: "dmz"
    },
    {
      adr: "192.169.200.201",
      net: "dmz-2"
    },
    {
      adr: "192.167.2.50",
      net: "dev"
    }
  ]
  
  var proxy = []
  var prx = new Daos.Proxy("Firewall", "10.10.1.200", "Service")
  proxy.push(prx)
  
  var zones = []
  var sz = new Daos.Zone("Untrust")
  var svc = new Daos.Zone("Service")
  var tz = new Daos.Zone("Trust")
  
  zones.push(sz)
  zones.push(svc)
  zones.push(tz)
  
  var tzones = []
  var tz = new Daos.Zone("Trust")
  tzones.push(tz)
  
  // var proxy = [
  //   {
  //     adr: "10.10.1.200",
  //     srczone: "untrust",
  //     dstzone: "trust",
  //     net: "Firewall",
  //   },
  // ]

  var sources = [
    {
      adr: "194.132.100.201",
      net: "Dienstleister1",
    },
    {
      adr: "10.10.1.202",
      net: "Dienstleister2",
    },
    {
      adr: "10.10.1.203",
      net: "Dienstleister3",
    },
    {
      adr: "10.10.1.204",
      net: "Dienstleister4"
    },
    // {
    //   adr: "10.10.1.200",
    //   net: "Dienstleister5"
    // },
  ]

  
  RunFirewallD3(proxy, sources, targets, zones)

  // console.log("raus")
})



// export { selItem };
export { createHTML };