import React from 'react'
import { Briefcase, Heart, Mail, Megaphone } from 'lucide-react'

const CHANNELS = [
  {
    icon: Mail,
    tone: 'purple',
    title: 'Email Us',
    email: 'hello@dossier.example',
    description: 'For general inquiries',
  },
  {
    icon: Megaphone,
    tone: 'green',
    title: 'Press & Media',
    email: 'press@dossier.example',
    description: 'For media and press inquiries',
  },
  {
    icon: Heart,
    tone: 'peach',
    title: 'Partnerships',
    email: 'partnerships@dossier.example',
    description: 'For partnership opportunities',
  },
  {
    icon: Briefcase,
    tone: 'blue',
    title: 'Careers',
    email: 'careers@dossier.example',
    description: 'Join our team',
  },
] as const

export const ContactChannels: React.FC = () => {
  return (
    <div className="contact-channels">
      <h2 className="contact-channels__title">Other ways to reach us</h2>
      <ul className="contact-channels__list">
        {CHANNELS.map(({ icon: Icon, tone, title, email, description }) => (
          <li key={title} className="contact-channels__item">
            <span className={`contact-channels__icon contact-channels__icon--${tone}`} aria-hidden="true">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <div className="contact-channels__body">
              <p className="contact-channels__item-title">{title}</p>
              <a className="contact-channels__email" href={`mailto:${email}`}>
                {email}
              </a>
              <p className="contact-channels__desc">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
