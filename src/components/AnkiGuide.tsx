import { href } from '../lib/router';

export function AnkiGuide() {
  return (
    <div className="guide">
      <div className="crumbs">
        <a href={href.home}>topics</a>
        <span aria-hidden="true">/</span>
        <span>anki</span>
      </div>
      <h2>Anki setup</h2>
      <p className="lede">Two ways to get Veyra cards into Anki. The file import always works.</p>

      <section className="card">
        <h3>A. Import a file (works everywhere)</h3>
        <ol>
          <li>
            On <a href={href.data}>Your data</a>, press <b>Download all cards</b>.
          </li>
          <li>
            In Anki choose <b>File → Import</b> and pick <code>veyra-anki.txt</code>.
          </li>
          <li>
            Keep <b>Allow HTML in fields</b> ticked. The file already declares tab separation and
            tags.
          </li>
        </ol>
      </section>

      <section className="card">
        <h3>B. Send directly (desktop Anki)</h3>
        <ol>
          <li>
            Install the <b>AnkiConnect</b> add-on (code <code>2055492159</code>) and restart Anki.
          </li>
          <li>
            Open <b>Tools → Add-ons → AnkiConnect → Config</b> and add this site to{' '}
            <code>webCorsOriginList</code>:
            <pre className="snippet" tabIndex={0}>
              {`"webCorsOriginList": [\n  "http://localhost",\n  "${location.origin}"\n]`}
            </pre>
          </li>
          <li>
            Keep desktop Anki open, then press <b>Send to Anki</b> on Your data.
          </li>
        </ol>
        <p className="muted small">
          Browsers block web pages from talking to localhost unless the add-on allows the page
          origin, so step 2 is required. Mobile browsers cannot reach desktop Anki; use the file
          import instead.
        </p>
      </section>
    </div>
  );
}
