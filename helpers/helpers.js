const nodemailer=require("nodemailer");
const sendMail=async(email,subject,mail)=>{
    return new Promise((resolve,reject)=>{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'tailorsoft88@gmail.com',
              pass: `${process.env.pass}`
            }
          });
          
          var mailOptions = {
            from: 'tailorsoft88@gmail.com',
            to: email,
            subject: subject,
            text: mail
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                reject(error)
            } else {
                resolve(info)
            }
          });
    })
}
exports.sendMail=sendMail;
