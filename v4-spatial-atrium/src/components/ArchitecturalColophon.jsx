import React from 'react';
import { ARCHITECT_DATA, recordBetaSignal } from '../config/architectData';
import { KineticBtn } from './SpatialHUD';
import Icon from './Icons';
import { playHoverTick } from '../utils/microAudio';

export default function ArchitecturalColophon({
  data = ARCHITECT_DATA,
  onOpenOverview,
  onScrollTop,
}) {
  const { owner, ui, commercial, v6 } = data;
  const col = ui.colophon;
  const techSources = col.sources.slice(0, 3);
  const legalSources = col.sources.slice(3);

  return (
    <footer className="site-footer" aria-label="Official Credits & Ecosystem">
      <div className="footer-inner">
        {/* IDENTITY ROW */}
        <div className="footer-identity">
          <div className="footer-identity-text">
            <h2 className="footer-name">{owner.name}</h2>
            <p className="footer-role">{col.architectRole}</p>
            <div className="footer-contacts">
              <a
                href={owner.directChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact"
                onPointerEnter={playHoverTick}
                onClick={() => recordBetaSignal('direct_phone_click')}
              >
                <Icon name="phone" size={15} />
                <span>{owner.displayPhone}</span>
              </a>
              <a
                href={owner.emailHref}
                className="footer-contact"
                onPointerEnter={playHoverTick}
                onClick={() => recordBetaSignal('direct_email_click')}
              >
                <Icon name="mail" size={15} />
                <span>{owner.email}</span>
              </a>
            </div>
          </div>
          <div className="footer-ctas">
            <KineticBtn variant="accent" onClick={onOpenOverview}>
              {col.open8kBtn}
            </KineticBtn>
            <KineticBtn variant="glass" icon="arrowUp" onClick={onScrollTop}>
              {v6.nav.top}
            </KineticBtn>
          </div>
        </div>

        {/* 3 LINK COLUMNS */}
        <div className="footer-columns">
          <div className="footer-col">
            <h3 className="footer-col-title">{v6.footer.links}</h3>
            <ul className="footer-list">
              {col.links.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                    onPointerEnter={playHoverTick}
                    onClick={() => recordBetaSignal(item.signal || 'ecosystem_click')}
                  >
                    <span className="footer-link-label">{item.label}</span>
                    <span className="footer-link-sub">{item.sub}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">{v6.footer.tech}</h3>
            <ul className="footer-list">
              {techSources.map((src, idx) => (
                <li key={idx} className="footer-source">
                  <span className="footer-source-key">{src.k}</span>
                  <span className="footer-source-val">{src.v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">{v6.footer.legal}</h3>
            <ul className="footer-list">
              {legalSources.map((src, idx) => (
                <li key={idx} className="footer-source">
                  <span className="footer-source-key">{src.k}</span>
                  <span className="footer-source-val">{src.v}</span>
                </li>
              ))}
              <li className="footer-source">
                <span className="footer-source-key">Stage</span>
                <span className="footer-source-val">
                  {(commercial?.commercialStage || 'beta_smoke_test').toUpperCase()} · MIT / Clean-IP
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{col.copyright}</span>
          <span>
            {owner.domain} · {owner.studioDomain}
          </span>
        </div>
      </div>
    </footer>
  );
}
