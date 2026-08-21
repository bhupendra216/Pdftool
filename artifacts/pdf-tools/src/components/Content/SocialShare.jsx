import { memo } from 'react';
import { Check, Copy, Facebook, Linkedin, MessageCircle, Twitter } from 'lucide-react';
import styles from './SocialShare.module.css';
import { copyToClipboard, nativeShare, shareOnFacebook, shareOnLinkedIn, shareOnTwitter, shareOnWhatsApp } from '@/utils/shareUtils';

const providerIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  whatsapp: MessageCircle,
};

function SocialShare({ url = 'https://pdfkira.com', title = 'PDFKira', description = 'Free PDF tools without signup or hidden fees.' }) {
  const shareText = `Just used ${title} on PDFKira — 100% free, no signup needed! 🚀 ${url}`;

  return (
    <section className={styles.section} aria-label="Share this page">
      <div className={styles.container}>
        <h2>Share this tool</h2>
        <div className={styles.row}>
          <button type="button" className={styles.button} onClick={() => shareOnTwitter(url, shareText)}>
            <Twitter size={18} />
            <span>Share on X</span>
          </button>
          <button type="button" className={styles.button} onClick={() => shareOnLinkedIn(url, title)}>
            <Linkedin size={18} />
            <span>Share on LinkedIn</span>
          </button>
          <button type="button" className={styles.button} onClick={() => shareOnFacebook(url)}>
            <Facebook size={18} />
            <span>Share on Facebook</span>
          </button>
          <button type="button" className={styles.button} onClick={() => shareOnWhatsApp(url, shareText)}>
            <MessageCircle size={18} />
            <span>Share on WhatsApp</span>
          </button>
          <button type="button" className={styles.button} onClick={() => copyToClipboard(`${title} ${url}`)}>
            <Copy size={18} />
            <span>Copy link</span>
          </button>
          <button type="button" className={styles.button} onClick={() => nativeShare({ title, text: description, url })}>
            <Check size={18} />
            <span>More options</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(SocialShare);
