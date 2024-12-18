import{loadCSS}from"./authModalsCSS.js";const config={authModalID:"",authServer:"",showLogInOutBtn:true,onLoginSuccess:()=>{},onLogoutSuccess:()=>{}};const state={currentDisplayID:"",initialized:false};function setErrorMsg(msg){console.log(`Seting error message: ${msg}`);const messageFailElements=document.getElementsByClassName(`${config.authModalID}_messageFail`);for(let c=0;c<messageFailElements.length;c++){messageFailElements[c].innerHTML=msg}}async function submitReq(type,data){function validateInput(data){const allKeyVals=(data,listing=[])=>{Object.keys(data).forEach(key=>{const value=data[key];if(typeof value!=="object"){listing.push({key:key,value:value})}else if(typeof value==="object"){allKeyVals(value,listing)}});return listing};const keyVals=allKeyVals(data);for(let c=0;c<keyVals.length;c++){let item=keyVals[c].value.replace(/ /g,"");if(item.length===0){setErrorMsg("You must fill in every field.");return false}if(keyVals[c].key==="email"){const emailRegex=/^\S+@\S+$/;if(!emailRegex.test(keyVals[c].value)){setErrorMsg("Email address not valid.");return false}}}return true}if(validateInput(data)){let response,result;if(type==="login"){response=await reqResp(data,"logInUser");result=await response.json();if(!result.success){if(result.respMsg==="NOT_MATCHED"){setErrorMsg("Email or password incorrect.")}else if(result.respMsg==="EMAIL_NOT_VERIFIED"){displayEmailNotVerified()}else{setErrorMsg("Login error.")}}else{config.onLoginSuccess();toggleLoginUI()}}else if(type==="newUser"){response=await reqResp(data,"createNewUser");result=await response.json();if(!result.success){if(result.respMsg==="EXISTS"){setErrorMsg("A user with that email already exists.")}}else{displayCheckEmailToValidate()}}else if(type==="forgotPswd"){response=await reqResp(data,"forgotPswd");result=await response.json();if(!result.success){setErrorMsg("Email invalid.")}else{displayVerifyPswdReset()}}}}let reqResp=async function(JSONtoSend,route){const url=config.authServer+"/"+route;let options={method:"post",credentials:"include",headers:{"Content-type":"application/json"},body:JSON.stringify(JSONtoSend)};return fetch(url,options)};const resendVerEmail=async function(email){const resp=await reqResp({email:email},"reSendVerifyEmail");console.log(`Response from reSendVerifyEmail: ${JSON.stringify(resp,null," ")}`);displayResentVerificationEmail()};const updateUI=showID=>{if(state.currentDisplayID.length>0){const element=document.getElementById(state.currentDisplayID);element.classList.toggle(`${config.authModalID}_hide`)}const element=document.getElementById(showID);element.classList.toggle(`${config.authModalID}_hide`);state.currentDisplayID=showID};const displayLogin=()=>{updateUI(`${config.authModalID}_authUI_loginUI`);document.getElementById(`${config.authModalID}_userName`).value="";document.getElementById(`${config.authModalID}_pswd`).value="";document.getElementById(`${config.authModalID}_userName`).focus()};const displayNewUser=()=>{updateUI(`${config.authModalID}_authUI_newUserUI`);document.getElementById(`${config.authModalID}_firstName`).focus()};const displayForgotPswd=()=>{updateUI(`${config.authModalID}_authUI_forgotPswdUI`);document.getElementById(`${config.authModalID}_forgotPswdUserName`).value="";document.getElementById(`${config.authModalID}_forgotPswdUserName`).focus()};const displayCheckEmailToValidate=()=>{updateUI(`${config.authModalID}_authUI_checkEmailToValidate`);state.currentDisplayID=`${config.authModalID}_authUI_checkEmailToValidate`};const displayVerifyPswdReset=()=>{updateUI(`${config.authModalID}_authUI_verifyPswdReset`);state.currentDisplayID=`${config.authModalID}_authUI_verifyPswdReset`};const displayEmailNotVerified=()=>{updateUI(`${config.authModalID}_authUI_emailNotVerified`);state.currentDisplayID=`${config.authModalID}_authUI_emailNotVerified`};const displayResentVerificationEmail=()=>{updateUI(`${config.authModalID}_authUI_resentVerificationEmail`);state.currentDisplayID=`${config.authModalID}_authUI_resentVerificationEmail`};const toggleLoginUI=()=>{const element=document.getElementById(`${config.authModalID}_authModal`);element.classList.toggle(`${config.authModalID}_hide`)};const updateLoginLogoutBtn=async()=>{const element=document.getElementById(`${config.authModalID}_loginLogoutBtn`);if(element){if(await isLoggedIn()){element.innerHTML="Log Out";element.classList.add(`${config.authModalID}_loginLogoutBtn_logoutMode`)}else{element.innerHTML="Login";element.classList.remove(`${config.authModalID}_loginLogoutBtn_logoutMode`)}}};const loadModals=async authModalID=>{const modalElement=document.createElement("span");modalElement.setAttribute("id",authModalID);document.body.appendChild(modalElement);document.getElementById(authModalID).innerHTML+=`
    ${config.showLogInOutBtn?await isLoggedIn()?`<div class="${config.authModalID}_top">
          <div id="${config.authModalID}_loginLogoutBtn" class="${config.authModalID}_loginLogoutBtn_logoutMode">Log Out</div>
        </div>`:`<div class="${config.authModalID}_top">
          <div id="${config.authModalID}_loginLogoutBtn">Login</div>
        </div>`:""}

    <div id="${config.authModalID}_authModal" class="${config.authModalID}_background ${config.authModalID}_hide">
    <div id="${config.authModalID}_loginBox" class="${config.authModalID}_box" onclick="event.stopPropagation()">

        <span id="${config.authModalID}_authUI_loginUI" class="${config.authModalID}_authUI_display ${config.authModalID}_hide"> 
          <div class="${config.authModalID}_topBar">
            <span class="${config.authModalID}_closeBtn" id="${config.authModalID}_closeBtn">&times;</span>
            <div class="${config.authModalID}_topBarText">Login</div>
          </div>
          <div class="${config.authModalID}_main">
            <form>
                <div class="${config.authModalID}_formArea">
                    <label for="${config.authModalID}_userName" class="${config.authModalID}_formAreaLabel">Email: </label>
                    <input type="text" id="${config.authModalID}_userName" class="${config.authModalID}_formAreaTextInput"  placeholder="user@example.com"/>
            
                    <label for="${config.authModalID}_pwd" class="${config.authModalID}_formAreaLabel">Password:</label>
                    <input type="password" id="${config.authModalID}_pswd" class="${config.authModalID}_formAreaTextInput" />
                </div>
                <div class="${config.authModalID}_buttonArea">
                    <div class="${config.authModalID}_button ${config.authModalID}_button_submit" id="${config.authModalID}_loginBtn">Login</div>
                </div>

                <div class="${config.authModalID}_optionsArea">
                    <div class="${config.authModalID}_newUser">New User</div>
                    <div class="${config.authModalID}_forgotPswd">Reset password</div>
                </div>

                <div class="${config.authModalID}_messageArea">
                    <span class="${config.authModalID}_messageFail"></span>
                </div>
            </form>
          </div>
        </span>

    
        <span id="${config.authModalID}_authUI_newUserUI" class="${config.authModalID}_authUI_display ${config.authModalID}_hide"> 
          <div class="${config.authModalID}_topBar">
            <span class="${config.authModalID}_closeBtn" id="${config.authModalID}_closeBtn">&times;</span>
            <div class="${config.authModalID}_topBarText">New User</div>
          </div>
          <div class="${config.authModalID}_main">
            <form>
                  <div class="${config.authModalID}_formArea">
                      <label for="${config.authModalID}_firstName" class="${config.authModalID}_formAreaLabel">First name: </label>
                      <input type="text" id="${config.authModalID}_firstName" class="${config.authModalID}_formAreaTextInput" />

                      <label for="${config.authModalID}_lastName" class="${config.authModalID}_formAreaLabel">Last name: </label>
                      <input type="text" id="${config.authModalID}_lastName" class="${config.authModalID}_formAreaTextInput"/>

                      <label for="${config.authModalID}_newUserName" class="${config.authModalID}_formAreaLabel">Email: </label>
                      <input type="text" id="${config.authModalID}_newUserName" class="${config.authModalID}_formAreaTextInput" placeholder="user@example.com"/>
              
                      <label for="${config.authModalID}_newUserPswd" class="${config.authModalID}_formAreaLabel">Password:</label>
                      <span>Choose a password you don't use anywhere else:</span>
                      <input type="password" id="${config.authModalID}_newUserPswd" class="${config.authModalID}_formAreaTextInput"/>
                  </div>

                  <div class="${config.authModalID}_buttonArea">
                          <div class="${config.authModalID}_button ${config.authModalID}_button_submit" id="${config.authModalID}_newUserBtn">Submit</div>
                  </div>
                  <div class="${config.authModalID}_optionsArea">
                      <div class="${config.authModalID}_login">Login</div>
                      <div class="${config.authModalID}_forgotPswd">Reset password</div>
                  </div>

                  <div class="${config.authModalID}_messageArea">
                      <span class="${config.authModalID}_messageFail"></span>
                  </div>
            </form>
          </div>
        </span>

    

        <span id="${config.authModalID}_authUI_forgotPswdUI" class="${config.authModalID}_authUI_display ${config.authModalID}_hide"> 
          <div class="${config.authModalID}_topBar">
            <span class="${config.authModalID}_closeBtn" id="${config.authModalID}_closeBtn">&times;</span>
            <div class="${config.authModalID}_topBarText">Reset Password</div>
          </div>

          <div class="${config.authModalID}_main">
            <form>
                    <div class="${config.authModalID}_formArea">
                    <label for="${config.authModalID}_forgotPswdUserName" class="${config.authModalID}_formAreaLabel">Email: </label>
                    <input type="text" id="${config.authModalID}_forgotPswdUserName"/>
                </div>

                <div class="${config.authModalID}_buttonArea">
                    <div class="${config.authModalID}_button ${config.authModalID}_button_submit" id="${config.authModalID}_forgotPswdBtn">Reset Password</div>
                </div>

                <div class="${config.authModalID}_messageArea">
                    <span class="${config.authModalID}_messageFail"></span>
                </div>
            </form>
          </div>
        </span>
    


        <span id="${config.authModalID}_authUI_checkEmailToValidate" class="${config.authModalID}_authUI_display ${config.authModalID}_hide"> 
              <div class="${config.authModalID}_topBar">
                <span class="${config.authModalID}_closeBtn" id="${config.authModalID}_closeBtn">&times;</span>
                <div class="${config.authModalID}_topBarText">Verify Email</div>
              </div>

              <div class="${config.authModalID}_main">
                <div class="${config.authModalID}_successMessage">
                  <div class="${config.authModalID}_successMsgTxt">An email has been sent to your address.</div>
                  <div class="${config.authModalID}_successMsgTxt">Before you can log in, check your email to verify your address.</div>
                </div>
              </div>
        </span>
    

        <span id="${config.authModalID}_authUI_verifyPswdReset" class="${config.authModalID}_authUI_display ${config.authModalID}_hide"> 
              <div class="${config.authModalID}_topBar">
                <span class="${config.authModalID}_closeBtn" id="${config.authModalID}_closeBtn">&times;</span>
                <div class="${config.authModalID}_topBarText">Reset Password</div>
              </div>

              <div class="${config.authModalID}_main">
                <div class="${config.authModalID}_successMessage">
                  <div class="${config.authModalID}_successMsgTxt">An email has been sent to your address with a link to reset your password.</div>
                </div>
              </div>
        </span>


        <span id="${config.authModalID}_authUI_emailNotVerified" class="${config.authModalID}_authUI_display ${config.authModalID}_hide"> 
              <div class="${config.authModalID}_topBar">
                <span class="${config.authModalID}_closeBtn" id="${config.authModalID}_closeBtn">&times;</span>
                <div class="${config.authModalID}_topBarText">Email Not Verified</div>
              </div>

              <div class="${config.authModalID}_main">
                <div class="${config.authModalID}_successMessage">
                  <div class="${config.authModalID}_successMsgTxt">Email not verified.</div>
                  <div class="${config.authModalID}_successMsgTxt">Check your email/spam box for a message to verify.</div>

                  <div class="${config.authModalID}_successMsgTxt">If you continue having trouble receiving the verification email, try using a different email account.</div>
                  
                  <div class="${config.authModalID}_successMsgTxt">To send another verification email to your address, click the button below:</div>
                  
                  <div class="${config.authModalID}_buttonArea" id="${config.authModalID}_resendVerifyEmailBtnArea">
                    <div class="${config.authModalID}_button ${config.authModalID}_button_info" id="${config.authModalID}_resendVerifyEmailBtn">Resend Verification Email</div>
                  </div>
                </div>
              </div>
        </span>


        <span id="${config.authModalID}_authUI_resentVerificationEmail" class="${config.authModalID}_authUI_display ${config.authModalID}_hide"> 
              <div class="${config.authModalID}_topBar">
                <span class="${config.authModalID}_closeBtn" id="${config.authModalID}_closeBtn">&times;</span>
                <div class="${config.authModalID}_topBarText">Verification Email Resent</div>
              </div>

              <div class="${config.authModalID}_main">
                <div class="${config.authModalID}_successMessage">
                  <div class="${config.authModalID}_successMsgTxt">An email to verify your account has been sent to your address.</div>
                  <div class="${config.authModalID}_successMsgTxt">Check your email inbox or spam box.</div>
                </div>
              </div>
        </span>


    </div>
    </div>
    `};const showAuthModal=()=>{toggleLoginUI();displayLogin()};const isLoggedIn=async()=>{const resp=await reqResp({},"isLoggedIn");const result=await resp.json();return result.respMsg};const logoutUser=async()=>{const logoutResp=await reqResp({},"logOutUser");const logoutResult=await logoutResp.json();if(logoutResult.success){config.onLogoutSuccess()}else{alert("logout fail.")}};const initAuthModals=async(authServer,onLoginSuccess=()=>{},onLogoutSuccess=()=>{},authModalID="authModals",showLogInOutBtn=true)=>{if(!state.initialized){config.authModalID=authModalID;config.authServer=authServer;config.showLogInOutBtn=showLogInOutBtn;config.onLoginSuccess=()=>{onLoginSuccess();updateLoginLogoutBtn()};config.onLogoutSuccess=()=>{onLogoutSuccess();updateLoginLogoutBtn()};state.initialized=true;loadCSS(authModalID);await loadModals(authModalID);if(showLogInOutBtn){const loginLogoutElement=document.getElementById(`${config.authModalID}_loginLogoutBtn`);loginLogoutElement.addEventListener("click",()=>{if(loginLogoutElement.classList.contains(`${config.authModalID}_loginLogoutBtn_logoutMode`)){logoutUser()}else{showAuthModal()}})}const forgotPswdLinks=document.querySelectorAll(`.${config.authModalID}_forgotPswd`);forgotPswdLinks.forEach(link=>{link.addEventListener("click",function handleClick(event){displayForgotPswd()})});const loginLinks=document.querySelectorAll(`.${config.authModalID}_login`);loginLinks.forEach(link=>{link.addEventListener("click",function handleClick(event){displayLogin()})});const newUserLinks=document.querySelectorAll(`.${config.authModalID}_newUser`);newUserLinks.forEach(link=>{link.addEventListener("click",function handleClick(event){displayNewUser()})});const closeX=document.querySelectorAll(`.${config.authModalID}_closeBtn`);closeX.forEach(link=>{link.addEventListener("click",function handleClick(event){toggleLoginUI()})});document.getElementById(`${config.authModalID}_authModal`).addEventListener("click",()=>{toggleLoginUI()});document.getElementById(`${config.authModalID}_loginBtn`).addEventListener("click",()=>{submitReq("login",{email:document.getElementById(`${config.authModalID}_userName`).value.trim(),pswd:document.getElementById(`${config.authModalID}_pswd`).value})});document.getElementById(`${config.authModalID}_newUserBtn`).addEventListener("click",()=>{submitReq("newUser",{email:document.getElementById(`${config.authModalID}_newUserName`).value.trim(),pswd:document.getElementById(`${config.authModalID}_newUserPswd`).value,userInfo:[{colName:"first_name",val:document.getElementById(`${config.authModalID}_firstName`).value},{colName:"last_name",val:document.getElementById(`${config.authModalID}_lastName`).value}]})});document.getElementById(`${config.authModalID}_forgotPswdBtn`).addEventListener("click",()=>{submitReq("forgotPswd",{email:document.getElementById(`${config.authModalID}_forgotPswdUserName`).value.trim()})});document.getElementById(`${config.authModalID}_resendVerifyEmailBtn`).addEventListener("click",()=>{const loginEmail=document.getElementById(`${config.authModalID}_userName`).value;resendVerEmail(loginEmail);console.log(`Sent message to: ${loginEmail}`)})}};export{showAuthModal,initAuthModals,updateLoginLogoutBtn};
