function PageLayout({ title, children }) {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4 text-gray-700 leading-7">
        {children}
      </div>
    </div>
  )
}

export function PrivacyPolicyPage() {
  return (
    <PageLayout title="Privacy Policy">
      <p>
        We collect basic personal information such as name, email, phone number, delivery address, and
        order details to process purchases and provide customer support.
      </p>
      <p>
        Your information is used only for order fulfillment, account management, service updates, and
        notification delivery (email, SMS, WhatsApp) related to your orders.
      </p>
      <p>
        We do not sell your personal data. We may share required information with payment, courier, and
        communication providers to complete your order.
      </p>
      <p>
        You can contact us at <strong>sathyaagro05@gmail.com</strong> to update or remove your account
        information, subject to legal and order record requirements.
      </p>
    </PageLayout>
  )
}

export function TermsOfServicePage() {
  return (
    <PageLayout title="Terms of Service">
      <p>
        By using this website, you agree to provide accurate account and order information and to use the
        platform only for lawful purchases.
      </p>
      <p>
        Product prices, stock, and delivery timelines may change without prior notice. Orders are confirmed
        only after successful placement in our system.
      </p>
      <p>
        We reserve the right to cancel suspicious or invalid orders and to block misuse of the platform.
      </p>
      <p>
        For any service concerns, contact <strong>sathyaagro05@gmail.com</strong> or call
        <strong> 9342807610</strong>.
      </p>
    </PageLayout>
  )
}

export function ShippingPolicyPage() {
  return (
    <PageLayout title="Shipping Policy">
      <p>
        We deliver fertilizer products to supported service locations through trusted delivery partners.
      </p>
      <p>
        Standard shipping timelines are shown at checkout. Admin may assign an order-specific delivery
        timeline, visible in your order tracking section.
      </p>
      <p>
        Delays may occur due to weather, transport restrictions, or local logistics conditions. We will
        update the order status in real time wherever possible.
      </p>
      <p>
        Ensure the provided address and phone number are accurate to avoid delivery failure.
      </p>
    </PageLayout>
  )
}

export function ReturnPolicyPage() {
  return (
    <PageLayout title="Return Policy">
      <p>
        Return requests are accepted only for valid cases such as wrong item delivered, damaged packaging,
        or severe product quality issues reported within the applicable return window.
      </p>
      <p>
        Opened or partially used fertilizer products may not be eligible for return unless a verified defect
        exists.
      </p>
      <p>
        To request a return, contact support with your order ID, product photos, and issue details.
      </p>
      <p>
        Approved refunds or replacements are processed as per internal verification and policy timelines.
      </p>
    </PageLayout>
  )
}

export function FaqPage() {
  return (
    <PageLayout title="FAQ">
      <p><strong>How do I track my order?</strong><br />Go to Account -&gt; Orders -&gt; Track.</p>
      <p><strong>Can I change address after placing order?</strong><br />Contact support immediately with your order ID.</p>
      <p><strong>Do you provide notifications?</strong><br />Yes, via in-app updates and configured email/SMS/WhatsApp channels.</p>
      <p><strong>How do I contact support?</strong><br />Email: sathyaagro05@gmail.com | Phone: 9342807610</p>
    </PageLayout>
  )
}

export function ContactSupportPage() {
  return (
    <PageLayout title="Contact Support">
      <p><strong>Email:</strong> sathyaagro05@gmail.com</p>
      <p><strong>Phone:</strong> 9342807610</p>
      <p>
        <strong>Address:</strong> 1/440, Mettur Road, Kottapalayam - 621003, Thuraiyur (TK), Trichy(DT)
      </p>
      <p>
        Support hours and response time may vary based on order volume. Please include your order ID for
        faster assistance.
      </p>
    </PageLayout>
  )
}

export function AboutUsPage() {
  return (
    <PageLayout title="About Us">
      <p>
        Sathya Agro is focused on providing reliable fertilizer products for better crop performance and
        sustainable agricultural outcomes.
      </p>
      <p>
        We combine product availability, practical agronomy support, and transparent order tracking so
        farmers can buy confidently.
      </p>
      <p>
        Our mission is to simplify fertilizer procurement with fair pricing, fast dispatch, and customer-first
        support.
      </p>
    </PageLayout>
  )
}

export function CareersPage() {
  return (
    <PageLayout title="Careers">
      <p>
        We are always interested in people passionate about agriculture, logistics, customer support, and
        technology.
      </p>
      <p>
        To apply, send your profile and role preference to <strong>sathyaagro05@gmail.com</strong>.
      </p>
      <p>
        Include your contact details, experience, and location so our team can reach you quickly.
      </p>
    </PageLayout>
  )
}

