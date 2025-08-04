import { Helmet } from "react-helmet-async";

interface BaseHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const BaseHelmet = ({
  title = "Medicine Reminder - Never Miss Your Medication",
  description = "A comprehensive medicine reminder app that helps you track your medications, set reminders, and maintain your health schedule. Stay on top of your medication routine with smart notifications and detailed reports.",
  keywords = "medicine reminder, medication tracker, health app, pill reminder, medication schedule, healthcare, medication management",
  image = "/medicine-reminder-og.jpg",
  url = "https://medicine-reminder.app",
}: BaseHelmetProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Medicine Reminder App" />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Medicine Reminder" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Medicine Reminder" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </Helmet>
  );
};

export default BaseHelmet;
