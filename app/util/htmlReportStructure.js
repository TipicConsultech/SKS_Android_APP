// import skslogo from './logo'
// export const ReportPage =`<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Service Report</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       margin: 10px;
//       color: #333;
//       padding:15px;
//     }
//     .border {
//       border: 2px solid black;
//       padding: 0px;
//       margin: 5px;
//     }
//     .header {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   border-bottom: 1px solid #000;
//   padding-bottom: 0px;
//   margin-top: 0px;
// }

// .header img {
//   width: 20%;
//   height: 80px;
//   margin-right: 10px;
//   object-fit: contain;
// }
// .commonBorder {
//     border: 10px solid black;
    
//     margin: 10px 0;
//     background-color: #f9f9f9; 
//   }

// .headerTextContainer {
//   width: 100%;
//    margin-left: 30px;
// }

// .headerRightContainer {
//   width:80%;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-end;
//   justify-content: center;
// }

// .title, .subTitle, .titlemo {
//   text-align: center;
//   margin-bottom: 0px; /* Removes default bottom margin */
// }

// .title {
//   font-size: 22px;
//   font-weight: bold;
// }

// .subTitle {
//   font-size: 18px;
//   margin-top: 5px; /* Adds a small top margin for spacing */
// }

// .titlemo {
//   font-size: 18px;
//   font-weight: bold;
//   margin-bottom: 15px; /* Adds a small top margin for spacing */
// }

// .surTitle {
//   font-size: 12px;
//   text-align: center;
//   border: 1px solid black;
//   margin: -10px auto 10px auto;
//   padding: 5px;
//   width: 150px;
//   background-color: white;
// }
   
//    .horizontalContainer {
//   margin-bottom: 10px;
// }
//    .horizontalItem {
//   width: 100%; /* Full width to ensure content fits nicely */
//   /* border: 1px solid black; */
//  padding: 10px;
//  /* border-top: none; */
//   display: flex;
//   flex-direction: column; /* Stack items vertically */
//   gap: 25px; /* Space between labels and values */
//   /* margin-left: none; */
//   border-right: 1px solid black;

  
// }
// .horizontalItems2 {
//   width: 100%; /* Full width to ensure content fits nicely */
//   /* border: 1px solid black;  */
//  padding: 10px;
//  border-top: none;
//   display: flex;
//   flex-direction: column; /* Stack items vertically */
//   gap: 10px; /* Space between labels and values */
//   margin-right:none;
  
// }
//         .horizontalItemtop {
//       width: 60%;
//       float:right;
//      float: left;
//     border-left: 1px solid black;
      
//       padding: 10px;
//       display: flex;
//       padding: 10px;
//       justify-content: space-between;
//     }   .horizontalItemtop2 {
//       width: 60%;
//       float:right;
//      float: left;
//       border: 1px solid black;
       
// border-left:1px solid black;
// border-bottom: none;
// border-right: none;

//       padding: 10px;
//       display: flex;
//       padding: 10px;
//       justify-content: space-between;
//     }
//     .label{
//       font-size: 12px;
//       font-weight: bold;
//       color: #333;
//     }
//       .labeltop {
//       font-size: 18px;
//       font-weight: bold;
//       color: #333;
//     }
//     .value {
//       font-size: 12px;
//       font-weight: bold;
//       color: #555;
//         margin-left: 20px;
//     }
//     .valuetop {
//       font-size: 18px;
//       font-weight: bold;
//       color: #555;
//     }
 
//     .surTitle {
//       font-size: 12px;
//       text-align: center;
//       font-weight: bold;
//       /* border: 1px solid black; */
//       margin: -14px auto ;
//       width: 150px;
//       margin-bottom: 0px;

//       background-color: white;
//       position: relative; /* or 'absolute' if you want to position it more freely */
//   z-index: 999;       /* Ensures the div is above other elements */
//   overflow: hidden;    
//     }
//     /* .section {
//       margin-bottom: 5px;
//       padding-bottom: 5px;
//     } */
   
//      .borderContainera {
//       /* border: 1px solid #ccc; */
//      /* border-left:1px solid black; */
//      border: 1px solid black;
//       margin-bottom: 1px;
//       margin-left: -1px;
//       padding: 5px;
//       margin-right:-1px;
//        background-color: #d3d3d3;
//     }
//      .sectionContainer {
//     width:50%; /* Half-width for customer and equipment sections */
//   }
//     .row {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 1px;
//     }
//     /* Spare Parts Table */
//     .tableContainer {
//       margin-top: 1px;
//       background-color: white;
//       /* border-radius: 8px; */
//       /* padding: 1px; */
//       /* box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); */
//     }
//     .sectionHeader {
//       font-size: 17px;
//       border-top:1px solid black;
//       font-weight: bold;
//       text-align:start;
//       background-color: #d3d3d3;
      
//       margin-bottom: 2px;       
//       border-bottom: 1.5px solid #000;
//     }
//     .tableHeader, .tableRow {
//     display: flex;
//     margin: -2px;
//     border: 1px solid black;
//     border-top: none;
// }

// .tableHeader div, .tableRow div {
//     border-left: 1px solid black;
//     text-align: center;
//     padding: 5px; /* Optional for spacing */
// }

// .tableHeader div:nth-child(1), /* Item */
// .tableRow div:nth-child(1),
// .tableHeader div:nth-child(3), /* Qty */
// .tableRow div:nth-child(3),
// .tableHeader div:nth-child(4), /* Remarks */
// .tableRow div:nth-child(4) {
//     flex: 1; /* Equal space */
// }

// /* Give more space to the Description column */
// .tableHeader div:nth-child(2), /* Description */
// .tableRow div:nth-child(2) {
//     flex: 3; /* Double the space */
// }
//     .signature_byContainer {
//       margin-top: 20px;
//       border-top: 1px solid black;
//     }
//     .signature_byBox {
//       display: flex;
//       /* border-left:1px solid black; */
      
//       justify-content: space-between;
//     }
//     .signature_byPlaceholder {
//       flex:1;
//       border: 1px solid black;
//       height: 130px;
//       display: flex;
//       justify-content: center;
//       border-left:none;
//       align-items: center;
//       margin: -1px;
//     }
//        .signature_byname {
//       flex: 1;
//       border: 1px solid black;
//       border-top:none;
//       border-bottom:none;

//       /* border-right:none; */
//       border-left:none;
//       /* border-top: 5px; */
//       height: 25px;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//        margin-left: -1px;  /* Add left margin */
//             margin-right: -1px; 
       
//     }
//     .namePlaceholder span {
//       color: #bbb;
//     }
     
   
   
//     .label {
//   font-size: 12px;
//   font-weight: bold;
//   color: #333;
//   margin: 0;
// }

// .value {
//   font-size: 12px;
//   font-weight: bold;
//   color: #555;
//   margin : 0;
// }
// .valueb {
//       font-size: 12px;
//       font-weight: bold;
//       color: #555;
//       margin-left: 30px;
//       }
//    .sectionContainer {
//   display: flex;
//   justify-content: space-between;
//   /* gap: 10px; Space between sections */
// }
// /* .applyFlex {
  
//     display: flex; /* Space between the two sections */
//    */
//     .customerDetails{
//   padding-top:11px;
//   width: 50%;
//   /* border-top:none; */
// }
// .equipmentDetails {
//   padding-top:11px;
//   width: 50%;
   
// }
// /* .equipmentDetails{
    
// } */

//     .borderContainer {
      
//       /* margin-left: -4px;
//       margin-right: -4px;
      
//       margin-bottom: 1px; */
//       display: flex; 
//     }
//     .row {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 1px;
//     }
//     .row1 {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin-right: -10px;
//   padding-left: 10px;
//   margin-left: -10px;
//   margin-bottom: 1px;
//   border-top: 1px solid black; /* Adding a bottom border */
//   padding-bottom: 1px; /* Optional padding for spacing between content and border */
// }
// .row6{
//   display: flex;
//   padding-left: 10px;
//   align-items: center;
//   justify-content: space-between;
//   margin-right: -10px;
//   margin-left: -10px;
//   margin-bottom: 1px;
//   border-top: 1px solid black; /* Adding a bottom border */
//   padding-bottom: 1px; /* Optional padding for spacing between content and border */
// }
//       logo {
//     width: 10;
//     height: 10;
//   }
//   </style>
// </head>
// <body>
//   <div class="border">
//     <div class="header">
   
//     <img src="data:image/png;base64, ${skslogo}" style="width: 150px; height: 120px; margin-left: 10px;" alt="skslogo" />
      
//       <!-- Header Text Container -->
//       <div class="headerTextContainer">
//         <p class="title">SMART KITCHEN SOLUTIONS</p>
//         <p class="subTitle">Office No 23, Konark Business Center, Mundhwa Pune - 411036</p>
//         <p class="titlemo">Contact No: 8600516230 / 8076614258</p>
//       </div>
      
//       <!-- Report Number and id -->
//       <div class="headerRightContainer">
//         <div class="horizontalItemtop">
//           <p class="labeltop">Report No:</p>
//           </br>
//           <p class="valuetop">${reportData1.id}</p>
//         </div>
//         <div class="horizontalItemtop2">
//           <p class="labeltop">Date:</p>
//           </br>
//           <p class="valuetop">${formattedDate}</p>
//         </div>
//       </div>
//     </div>

//     <p class="surTitle">SERVICE REPORT</p>

    
//     <!-- Customer Details -->
//    <!-- Customer Details -->
//    <!-- Wrapper for Customer and Equipment Details with Shared Border -->
// <div class="borderContainer">
  
//     <!-- Customer Details Section -->
//     <div class="customerDetails sectionContainer" >
//       <div class="horizontalItem customerInfo">
//         <div>
//           <div class="row">
//           <p class="label">Customer Name:</p>
//         <p class="value">${reportData1.customer_name}</p> 
//             <!-- <p class="value">Hayat Hotel,Sangli.,miraj,pune,mumbai</p> -->
//           </div>
//         </div>
//         <div>
//           <div class="row">
//           <p class="label">Address:</p>
//           <p class="value">${reportData1.address}</p>
//           </div>
//         </div>
//         <div style="padding-top:10px;margin-bottom: 20px;" >
        
//       <div class="row6">
//         <p class="label">Contact Number:</p>
//         <p class="value">${reportData1.mobile}</p>
//       </div>
//       <div class="row6">
//         <p class="label">Contact Person:</p>
//         <p class="value">${reportData1.contact_person}</p>
//       </div>
//     </div>
//       </div>
//     </div>

//     <!-- Equipment Details Section -->
//     <div class="customerDetails sectionContainer">
//       <div class="horizontalItems2">
//         <div class="row">
//           <p class="label">Type of Call:</p>
//           <p class="value">${reportData1.call_type}</p>
//         </div>
//         <div class="row1">
//           <p class="label">Model / PNC:</p>
//           <p class="value">${reportData1.model}</p>
//         </div>
//         <div class="row1">
//           <p class="label">Serial No.:</p>
//           <p class="value">${reportData1.serial_no}</p>
//         </div>
//         <div class="row1">
//           <p class="label">Equipment Name:</p>
//           <p class="value">${reportData1.equipment_name}</p>
//         </div>
//         <div class="row1">
//           <p class="label">Location:</p>
//           <p class="value">${reportData1.location}</p>
//         </div>
//       </div>
//     </div>
 
// </div>
//     <!-- Nature of Complaint and Final Status -->
    
//      <div class="section">
//       <div class="borderContainera">
//         <div class="row">
//           <p class="label">Nature of Complaint:</p>
//         </div>
//       </div>
//     </div>
//     <div class="section">
//       <div class=>
//         <div class="row">
//         <p class="valueb">${reportData1.nature_complaint}</p>
//         </div>
//       </div>
//     </div>
//     <div class="section">
//       <div class="borderContainera">
//         <div class="row">
//           <p class="label">Actual Fault:</p>
//         </div>
//       </div>
//     </div>
//     <div class="section">
//       <div class=>
//         <div class="row">
//         <p class="valueb">${reportData1.actual_fault}</p>
//         </div>
//       </div>
//     </div>
//      <div class="section">
//       <div class="borderContainera">
//         <div class="row">
//           <p class="label">Action Taken/To be taken:</p>
         
//         </div>
//       </div>
//     </div>
//     <div class="section">
//       <div class=>
//         <div class="row">
//        <p class="valueb">${reportData1.action_taken}</p>
//         </div>
//       </div>
//     </div>
//     <div class="section">
//       <div class="borderContainera">
//         <div class="row">
//           <p class="label">Final Status:</p>
         
//         </div>
//       </div>
//     </div>
//     <div class="section">
//       <div class=>
//         <div class="row">
//        <p class="valueb">${reportData1.status}</p>
//         </div>
//       </div>
//     </div>
      
//       <div class="section">
//       <div class="borderContainera">
//         <div class="row">
//           <p class="label">Customer Suggestions:</p>
          
//         </div>
//       </div>
//     </div>
//     <div class="section">
//       <div class=>
//         <div class="row">
//     <p class="valueb">${reportData1.customer_suggestion}</p>
//         </div>
//       </div>
//     </div>

//     <!-- Spare Parts Used -->
//     <div class="tableContainer">
//       <p class="sectionHeader">Required or Replaced Spare Parts</p>
//       <div class="tableHeader">
//         <div>Item</div>
//         <div>Description</div>
//         <div>Qty</div>
//         <div>Remarks</div>
//       </div>
//       ${sparePartsData1.map(part => `
//         <div class="tableRow">
//           <div>${part.id}</div>
//           <div>${part.description}</div>
//           <div>${part.qty}</div>
//           <div>${part.remark}</div>
//         </div>
//       `).join('')}
//     </div>

//     <!-- name Section -->
//        <div class="signature_byContainer">
//       <div class="signature_byBox">
//         <div class="signature_byname"> <p class="label">Signature By:</p>
//             <p class="value">${reportData1.signature_by}</p></div>
//         <div class="signature_byname"> <p class="label">Service Engg Name:</p>
//             <p class="value">${user.name}</p></div>    
//       </div>
//        <div class="signature_byBox">
//        <div class="signature_byPlaceholder">
//         <img src="${reportData1.signature}" style="width: 180px; height: 100px;" alt="Signature" />
//      </div>
//         <div class="signature_byPlaceholder"><span>Name: ${user.name} </span></div>
      
//       </div>
//     </div>
//   </div>
// </body>
// </html>`;
