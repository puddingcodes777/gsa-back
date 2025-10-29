export const getEmailContent = (link: string) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                padding: 20px;
                border: 1px solid #dddddd;
                border-radius: 8px;
              }
              .email-header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #eeeeee;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
              }
              .email-header a {
                text-decoration: none;
              }
              .email-header h1 {
                color: #666666;
              }
              .email-body {
                padding: 20px 0;
                color: #666666;
                line-height: 1.5;
              }
              .email-button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #ffffff;
                background: #007bff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
              .email-footer {
                margin-top: 20px;
                font-size: 12px;
                color: #aaaaaa;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <a href="https://gsagrading.com">
                  <h1>GSA</h1>
                </a>
              </div>
              <div class="email-body">
                <p>Hello,</p>
                <p>
                  Thank you for signing up! Please verify your email address by clicking
                  the button below:
                </p>
                <a
                  href="${link}"
                  class="email-button"
                  target="_blank"
                >
                  Verify Email
                </a>
                <p>
                  If you did not create an account with us, you can safely ignore this
                  email.
                </p>
              </div>
              <div class="email-footer">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
};
