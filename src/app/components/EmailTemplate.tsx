import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome a Verde Manzana, {firstName}!</h1>
  </div>
);

export default EmailTemplate
