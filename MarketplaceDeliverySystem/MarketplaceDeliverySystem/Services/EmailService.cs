using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
namespace MarketplaceDeliverySystem.Services
{
    // Responsible for sending emails from the system.
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        // IConfiguration reads EmailSettings from appsettings.json.
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOrderConfirmationAsync(
            string customerEmail,
            string customerName,
            int orderId,
            decimal totalAmount)
        {
            // Read the email settings.
            string smtpServer =
                _configuration["EmailSettings:SmtpServer"]
                ?? throw new InvalidOperationException(
                    "SMTP server is missing.");

            int port = int.Parse(
                _configuration["EmailSettings:Port"]
                ?? throw new InvalidOperationException(
                    "SMTP port is missing."));

            string senderName =
                _configuration["EmailSettings:SenderName"]
                ?? "Marketplace Delivery System";

            string senderEmail =
                _configuration["EmailSettings:SenderEmail"]
                ?? throw new InvalidOperationException(
                    "Sender email is missing.");

            string username =
                _configuration["EmailSettings:Username"]
                ?? throw new InvalidOperationException(
                    "Email username is missing.");

            string password =
                _configuration["EmailSettings:Password"]
                ?? throw new InvalidOperationException(
                    "Email password is missing.");

            // Create the email message.
            MimeMessage message = new MimeMessage();

            message.From.Add(
                new MailboxAddress(senderName, senderEmail));

            message.To.Add(
                new MailboxAddress(customerName, customerEmail));

            message.Subject =
                $"Order #{orderId} Confirmation";

            message.Body = new TextPart("html")
            {
                Text = $"""
                    <h2>Order Confirmed</h2>

                    <p>Hello {customerName},</p>

                    <p>Your order has been placed successfully.</p>

                    <p><strong>Order ID:</strong> {orderId}</p>

                    <p>
                        <strong>Total amount:</strong>
                        {totalAmount:0.000}
                    </p>

                    <p>
                        <strong>Status:</strong> Pending
                    </p>

                    <p>Thank you for using Marketplace Delivery System.</p>
                    """
            };

            // Connect and send the email.
            using SmtpClient client = new SmtpClient();

            await client.ConnectAsync(
                smtpServer,
                port,
                SecureSocketOptions.StartTls);

            await client.AuthenticateAsync(
                username,
                password);

            await client.SendAsync(message);

            await client.DisconnectAsync(true);
        }
    }
}