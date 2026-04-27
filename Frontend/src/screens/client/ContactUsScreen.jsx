import { useState } from "react";
import { useGetContactsQuery, useRegisterUserMutation } from "../../services/api";
import { Helmet } from "react-helmet-async";

const officeAddress =
  "694 Office Unit, Vegas Mall, Dwarka Sector -14, New Delhi -110078, INDIA";

const contactCards = [
  {
    label: "Phone Number",
    value: "1800-8899-410",
    href: "tel:18008899410",
    Icon: PhoneIcon,
    tone: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    label: "WhatsApp",
    value: "+91 1800-8899-410",
    href: "https://wa.me/9118008899410",
    Icon: WhatsappIcon,
    tone: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    label: "Email",
    value: "sales@exultedindia.com",
    href: "mailto:sales@exultedindia.com",
    Icon: MailIcon,
    tone: "bg-cyan-50 text-cyan-600 border-cyan-100",
  },
];
const initialFormState = {
  name: "",
  mobileNumber: "",
  email: "",
  message: "",
};

const initialErrorState = {
  name: "",
  mobileNumber: "",
  email: "",
  message: "",
};

function ContactUsScreen() {
  const {data,isLoading,error} = useGetContactsQuery();
  const [registerUser,{isLoading: isRegistering}] = useRegisterUserMutation();
  const contactInfo = data?.data ;
  console.log("contact info", contactInfo);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {
      name: formData.name.trim() ? "" : "Name is required.",
      mobileNumber: formData.mobileNumber.trim()
        ? ""
        : "Mobile number is required.",
      email: formData.email.trim() ? "" : "Email is required.",
      message: formData.message.trim() ? "" : "Message is required.",
    };

    if (
      formData.mobileNumber.trim() &&
      !/^\d{10,15}$/.test(formData.mobileNumber.trim())
    ) {
      nextErrors.mobileNumber =
        "Enter a valid mobile number with 10 to 15 digits.";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors(initialErrorState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    };

    try {
      const response = await registerUser(payload).unwrap();
      console.log("user create response:", response);
      resetForm();
      // setIsCreateModalOpen?.(false);
      // onClose();
    } catch (error) {
      console.log("error while creating user:", error);
    }
  };

  return (
    <main className="relative overflow-hidden bg-[#F8FAFC] text-[#111827]">
      <Helmet>
        <title>Contact Us | Exulted India</title>
        <meta name="description" content="Get in touch with Exulted India for inquiries, support, or to learn more about our power products and services. Contact us via phone, WhatsApp, email, or visit our office at Vegas Mall, Dwarka Sector 14, New Delhi." />
        <meta name="keywords" content="Exulted India contact, customer support, inquiries, phone number, WhatsApp, email, office address, Vegas Mall contact" />
      </Helmet>
      <BackgroundDecor />
      <section className="relative">
        <div className="h-85 w-full overflow-hidden border-b border-blue-100 bg-blue-50 sm:h-107.5 lg:h-130">
          <iframe
            title="Exulted India office location at Vegas Mall, Dwarka Sector 14, New Delhi"
            src={contactInfo?.mapLocation}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full"
          />
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="-mt-24 grid gap-4 sm:grid-cols-2 lg:-mt-28 lg:grid-cols-3">
          {/* {contactCards.map((card, index) => ( */}
            <ContactCard  card={contactCards[0]} contactInfo={contactInfo} label={"Phone Number"}  value = {contactInfo?.phoneNumber}  />
            <ContactCard  card={contactCards[1]} contactInfo={contactInfo} label={"WhatsApp"}  value = {contactInfo?.whatappNumber }/>
            <ContactCard  card={contactCards[2]} contactInfo={contactInfo} label={"Email"}  value = {contactInfo?.email} />
          {/* ))} */}
        </div>

        <div className="mt-10 grid gap-7 lg:mt-14 lg:grid-cols-[0.92fr_1.08fr]">
          <GetInTouchCard contactInfo={contactInfo} />
          <ContactFormCard handleSubmit={handleSubmit} formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} isLoading={isRegistering} updateField={updateField} />
        </div>
      </section>
    </main>
  );
}

function ContactCard({ card, contactInfo, label,value }) {
  const CardIcon = card.Icon;
  


  return (
    <a
      // href={card.href}
      // target={card.href.startsWith("http") ? "_blank" : undefined}
      // rel={card.href.startsWith("http") ? "noreferrer" : undefined}
      className="group rounded-[26px] border border-white/80 bg-white/92 p-5 shadow-[0_22px_80px_rgba(15,91,191,0.13)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_30px_95px_rgba(15,91,191,0.18)] motion-safe:animate-[contactFadeUp_650ms_ease-out_both]"
      // style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <span
          className={`grid h-13 w-13 shrink-0 place-items-center rounded-2xl border ${card.tone} transition duration-300 group-hover:scale-105`}
        >
          <CardIcon className="h-6 w-6" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            {label}
          </span>
          <span className="mt-1 block `wrap-break-word text-base font-black text-[#111827] sm:text-lg">
            {value}
          </span>
        </span>
      </div>
    </a>
  );
}

function GetInTouchCard({ contactInfo }) {
  return (
    <article className="relative overflow-hidden rounded-4xl border border-blue-100 bg-[#EEF7FF] p-6 shadow-[0_24px_90px_rgba(15,91,191,0.1)] sm:p-8 lg:p-10">
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full blur-3xl" />

      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 shadow-sm backdrop-blur">
          <MapPinIcon className="h-4 w-4" />
          Contact Office
        </span>

        <h1 className="mt-6 text-3xl font-black leading-tight text-[#111827] sm:text-4xl">
          {contactInfo?.heading || "Get in touch"}
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          {contactInfo?.detail }
        </p>

        <div className="mt-8 space-y-6">
          <InfoBlock title="Address">
            <p>{contactInfo?.address}</p>
            {/* <p>694 Office Unit,</p>
            <p>Vegas Mall, Dwarka Sector -14,</p>
            <p>New Delhi -110078</p>
            <p>INDIA</p> */}
          </InfoBlock>

          <InfoBlock title="Email">
            <a
              href={`mailto:${contactInfo?.email}`}
              className="font-semibold text-slate-700 transition hover:text-blue-600"
            >
              {contactInfo?.email}
            </a>
          </InfoBlock>

          <InfoBlock title="Toll Free No">
            <a
              href={`tel:${contactInfo?.phoneNumber}`}
              className="font-semibold text-slate-700 transition hover:text-blue-600"
            >
              {contactInfo?.phoneNumber}
            </a>
          </InfoBlock>
        </div>
      </div>
    </article>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#111827]">
        {title}
      </h2>
      <div className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">{children}</div>
    </div>
  );
}

function ContactFormCard({ handleSubmit, formData, setFormData, errors, setErrors, isLoading ,updateField={updateField}}) {
  return (
    <article className="rounded-4xl border border-blue-100 p-6 shadow-[0_24px_90px_rgba(16,185,129,0.1)] sm:p-8 lg:p-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">
            Send Message
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#111827] sm:text-4xl">
            Let's connect
          </h2>
        </div>
        <span className="hidden h-14 w-14 place-items-center rounded-2xl bg-white text-emerald-600 shadow-lg shadow-emerald-200/60 sm:grid">
          <SendIcon className="h-6 w-6" />
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
  <FloatingInput
    id="firstName"
    label="First name"
    type="text"
    value={formData.name}
    onChange={(event) => updateField("name", event.target.value)}
    error={errors.name}
  />

  <FloatingInput
    id="email"
    label="Email"
    type="email"
    value={formData.email}
    onChange={(event) => updateField("email", event.target.value)}
    error={errors.email}
  />

  <FloatingInput
    id="mobile"
    label="Mobile number"
    type="tel"
    value={formData.mobileNumber}
    onChange={(event) => updateField("mobileNumber", event.target.value)}
    error={errors.mobileNumber}
  />

  <label className="block">
    <span className="mb-2 block text-sm font-black text-slate-700">
      Message
    </span>

    <textarea
      rows="5"
      value={formData.message}
      onChange={(event) => updateField("message", event.target.value)}
      placeholder="Write your message here"
      className={`min-h-34 w-full resize-none rounded-[22px] border bg-white/86 px-4 py-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
        errors.message
          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
          : "border-emerald-100 focus:border-emerald-400 focus:ring-emerald-100"
      }`}
    />

    {errors.message && (
      <p className="mt-2 text-xs font-semibold text-red-500">
        {errors.message}
      </p>
    )}
  </label>

  <button
    type="submit"
    disabled={isLoading}
    className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#111827] px-6 text-sm font-black text-white shadow-xl shadow-slate-900/18 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70 sm:w-max"
  >
    {isLoading ? "Submitting..." : "Send message"}
    <SendIcon className="h-4 w-4" />
  </button>
</form>
    </article>
  );
}

function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
  error,
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`h-13 w-full rounded-[22px] bg-white/86 px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
          error
            ? "border border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border border-emerald-100 focus:border-emerald-400 focus:ring-emerald-100"
        }`}
      />

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-500">
          {error}
        </p>
      )}
    </label>
  );
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-28 top-105 h-80 w-80 rounded-full bg-blue-300/18 blur-3xl" />
      <div className="absolute right-0 top-155 h-96 w-96 rounded-full bg-emerald-300/14 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-cyan-300/14 blur-3xl" />
      <LocalStyles />
    </div>
  );
}

function LocalStyles() {
  return (
    <style>
      {`
        @keyframes contactFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}
    </style>
  );
}

function IconShell({ className, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.78 19.78 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.78 19.78 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.92.33 1.82.63 2.68a2 2 0 0 1-.45 2.11L8 9.8a16 16 0 0 0 6.2 6.2l1.29-1.29a2 2 0 0 1 2.11-.45c.86.3 1.76.51 2.68.63A2 2 0 0 1 22 16.92Z" />
    </IconShell>
  );
}

function WhatsappIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M3 21l1.7-4.5A8.6 8.6 0 1 1 8 19.5L3 21Z" />
      <path d="M9.3 8.4c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.3 0 .5-.2.7l-.4.5c.7 1.2 1.7 2.1 3 2.7l.5-.6c.2-.2.5-.3.8-.2l1.6.7c.3.1.4.3.4.6v.5c0 .3-.1.5-.4.7-.4.3-.9.5-1.5.5-3.4 0-7.4-3.5-7.4-7.2 0-.6.2-1.1.7-1.6Z" />
    </IconShell>
  );
}

function MailIcon({ className }) {
  return (
    <IconShell className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </IconShell>
  );
}

function MapPinIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </IconShell>
  );
}

function SendIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </IconShell>
  );
}

export default ContactUsScreen;
