const loadCSS = (authModalID = "authModals") => {
  const styleDef = `.${authModalID}_button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px;
    padding-right: 7px;
    padding-left: 7px;
    margin-right: 3px;
    margin-left: 3px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    color: black;
    border-radius: 3px;
    user-select: none;
  }
  
  .${authModalID}_button:hover {
    cursor: pointer;
    filter: brightness(95%);
  }

  
  
  .${authModalID}_button_submit {
    border: 2px solid rgb(42, 168, 76);
    background-color: rgb(42, 168, 76);
    color: white;
  }
  
  .${authModalID}_button_info {
    border: 2px solid black;
    background-color: skyblue;
    color: black;
  }
  
  /* The full-page modal background (semi-transparent overlay). */
  .${authModalID}_background {
    display: block;
  
    /* Keep on top */
    // z-index: 999;
    z-inxed: 1501;
  
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  
    background-color: rgba(0, 0, 0, 0.3);
    /* Black background with translucent opacity. */
  
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    user-select: none;
    -webkit-user-select: none;
  }
  
  /* Class to hide the modal (instead of showing it with .CollabAccountModal-background). */
  .${authModalID}_hide {
    display: none;
  }
  
  
  /* The modal box that sits in full-page semi-transparent background . */
  .${authModalID}_box {
    position: relative;
    margin: auto;
    margin-top: 180px;
    width: 380px;
    background-color: white;
    box-shadow: 2px 2px 9px rgba(0, 0, 0, 0.2);
  
    animation-name: slidein;
    animation-duration: 0.5s;
  }
  
  
  @keyframes slidein {
    from {
      top: -500px;
    }
  
    to {
      top: 0;
    }
  }
  
  
  /* Top bar of modal with title and closeBtn. */
  .${authModalID}_topBar {
    box-sizing: border-box;

    margin-bottom: 10px;
    padding-top: 1px;
    padding-bottom: 2px;
    padding-left: 14px;
    padding-right: 5px;
    background-color: dodgerblue;
    color: white;
    width: 100%;
  }
  
  .${authModalID}_topBarText {
    line-height: 30px;
    color: white;
    font-size: 14pt;
  }
  
  /* Close "X" modal button. */
  .${authModalID}_closeBtn {
    color: white;
    float: right;
    font-size: 22px;

    padding-top: 2px;
    padding-right: 2px;
  }
  
  .${authModalID}_closeBtn:hover {
    color: black;
    cursor: pointer;
  }
  
  
  /* Main UI area of modal box. */
  .${authModalID}_main {
    padding-left: 15px;
    padding-right: 15px;
  
    padding-bottom: 3px;
  }
  
  /* Area for success messages. */
  .${authModalID}_messageArea {
    margin-top: 10px;
    background-color: white;
    text-align: right;
  }
  
  /* Area for error messages. */
  .${authModalID}_messageFail {
    color: red;
  }
  
  
  /*********************/
  .${authModalID}_formArea {
    display: grid;
    grid-template-columns: 75px 1fr;
    grid-gap: 10px;
  }
  
  .${authModalID}_formAreaLabel {
    grid-column: 1 / 2;
  }
  
  .${authModalID}_formAreaTextInput {
    grid-column: 2 / 3;
    padding-left: 5px;
    font-size: 14px;
  }
  
  
  .${authModalID}_login {
    color: dodgerblue;
  }
  
  .${authModalID}_login:hover {
    cursor: pointer;
    filter: brightness(80%);
  }
  
  
  .${authModalID}_newUser {
    color: dodgerblue;
  }
  
  .${authModalID}_newUser:hover {
    cursor: pointer;
    filter: brightness(80%);
  }
  
  
  .${authModalID}_forgotPswd {
    color: dodgerblue;
  }
  
  .${authModalID}_forgotPswd:hover {
    cursor: pointer;
    filter: brightness(90%);
  }
  
  /*********************/
  .${authModalID}_successMessage {
    padding-top: 0px;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 15px;
  
    background-color: white;
    color: black;
    font-size: 18px;
  }
  
  .${authModalID}_successMsgTxt {
    font-size: 16px;
    padding-bottom: 10px;
  }
  
  
  .${authModalID}_buttonArea {
    width: 100%;
    margin-top: 10px;
  }
  
  .${authModalID}_optionsArea {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }
  
  
  /***************/
  .${authModalID}_top {
    // z-index: 1;
    // z-index: calc(infinity);
    z-index: 1500;
    position: fixed;
    height: 0px;
    /* MENU BAR HIDDEN 0px */
    width: 100%;
    padding: 0px;
    /* MENU BAR HIDDEN 0px */
    text-align: right;
    background-color: slategray;
    color: white;
    font-weight: bold;
  
    /* position:absolute; */
    top: 0;
    right: 0;
  }
  
  #${authModalID}_loginLogoutBtn {
    background-color: rgb(42, 168, 76);
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    color: white;
    padding: 7px 10px 5px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    font-weight: 100;
  }
  
  #${authModalID}_loginLogoutBtn:hover {
    cursor: pointer;
    filter: brightness(95%);
  }
  
  .${authModalID}_loginLogoutBtn_logoutMode {
    color: black !important;
    background-color: white !important; # Set important to override CSS set on ID #${authModalID}_loginLogoutBtn.
  }
  
  #${authModalID}_resendVerifyEmailBtnArea {
    margin-bottom: 5px;
  }`;


  const styleElem = document.createElement('style');
  styleElem.innerHTML = styleDef;
  document.head.appendChild(styleElem);
}


export { loadCSS };