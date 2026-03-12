import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-text-secondary/10 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-1">
            <span className="text-lg font-bold text-text-primary">
              Harmony<span className="text-primary">Set</span>
            </span>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Mathematically perfect DJ sets. Built by the creator of{' '}
              <a href="https://psychedelic-universe.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary transition-colors hover:text-primary underline">Psychedelic Universe</a>.
            </p>
          </div>
          {/* Tool */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Tool
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/optimize" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Optimize Your Playlist
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          {/* Guides */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Guides
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/guides/harmonic-mixing-guide" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Harmonic Mixing Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/rekordbox-playlist-optimizer" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Rekordbox Playlist Optimizer
                </Link>
              </li>
              <li>
                <Link href="/guides/circle-of-fifths-for-djs" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Circle of Fifths for DJs
                </Link>
              </li>
              <li>
                <Link href="/guides/dj-set-energy-flow" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  DJ Set Energy Flow
                </Link>
              </li>
            </ul>
          </div>
          {/* Account */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Account
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/login" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="mt-10 border-t border-text-secondary/10 pt-6 flex flex-col items-center gap-4 text-sm text-text-secondary">
          {/* Social icons */}
          <div className="flex items-center gap-4">
            <a href="https://youtube.com/@PsychedelicUniverse" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-text-secondary transition-colors hover:text-[#84cc16]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"/></svg>
            </a>
            <a href="https://soundcloud.com/psychedelic_universe" target="_blank" rel="noopener noreferrer" aria-label="SoundCloud" className="text-text-secondary transition-colors hover:text-[#84cc16]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.05-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.172 1.282c.013.06.045.094.104.094.057 0 .09-.035.104-.094l.199-1.282-.199-1.332c-.014-.057-.047-.094-.104-.094m1.824-1.18c-.066 0-.114.056-.12.12l-.217 2.487.217 2.398c.006.066.054.12.12.12.063 0 .114-.054.12-.12l.248-2.398-.248-2.487c-.006-.064-.057-.12-.12-.12m.824-.24c-.074 0-.133.06-.138.134l-.197 2.727.197 2.628c.005.074.064.133.138.133.075 0 .134-.06.14-.133l.224-2.628-.224-2.727c-.006-.074-.065-.134-.14-.134m.822-.156c-.082 0-.148.066-.153.148l-.182 2.883.182 2.775c.005.084.071.148.153.148.08 0 .147-.064.152-.148l.21-2.775-.21-2.883c-.005-.082-.072-.148-.152-.148m.83-.182c-.09 0-.163.074-.168.166l-.165 3.065.165 2.869c.005.09.078.163.168.163.088 0 .163-.073.167-.163l.19-2.869-.19-3.065c-.004-.092-.079-.166-.167-.166m.83-.12c-.1 0-.18.082-.184.182l-.15 3.185.15 2.919c.004.098.084.178.183.178.098 0 .178-.08.183-.178l.17-2.919-.17-3.185c-.005-.1-.085-.182-.183-.182m.85-.126c-.107 0-.193.086-.196.195l-.136 3.311.136 2.965c.003.108.089.195.196.195.108 0 .193-.087.197-.195l.154-2.965-.154-3.311c-.004-.109-.09-.195-.197-.195m.867.22c-.003-.118-.098-.21-.213-.21-.116 0-.21.092-.213.21l-.121 3.091.121 2.986c.003.117.097.208.213.208.115 0 .21-.091.213-.208l.14-2.986-.14-3.091m.695-1.394c-.122 0-.221.1-.224.224l-.12 4.485.12 2.996c.003.125.102.224.224.224.12 0 .221-.1.224-.224l.136-2.996-.136-4.485c-.003-.124-.104-.224-.224-.224m.87-.227c-.13 0-.236.108-.238.238l-.105 4.712.105 3.008c.002.132.108.238.238.238.131 0 .236-.106.239-.238l.12-3.008-.12-4.712c-.003-.13-.108-.238-.239-.238m.867-.21c-.14 0-.252.114-.254.254l-.09 4.922.09 3.012c.002.14.114.254.254.254.139 0 .252-.114.254-.254l.103-3.012-.103-4.922c-.002-.14-.115-.254-.254-.254m.877-.2c-.148 0-.268.12-.27.268l-.074 5.122.074 3.016c.002.15.122.268.27.268.147 0 .267-.12.269-.268l.085-3.016-.085-5.122c-.002-.148-.122-.268-.269-.268m.87-.065c-.158 0-.285.128-.287.285l-.058 5.187.058 3.012c.002.157.129.285.287.285.156 0 .284-.128.285-.285l.066-3.012-.066-5.187c-.001-.157-.129-.285-.285-.285m.87.128c-.165 0-.299.134-.3.3l-.044 5.059.044 3.004c.001.166.135.3.3.3.164 0 .298-.134.3-.3l.05-3.004-.05-5.059c-.002-.166-.136-.3-.3-.3m2.378-.535c-.203 0-.349.098-.445.206a4.574 4.574 0 0 0-1.435-.233c-.27 0-.535.03-.791.087-.168.038-.213.078-.213.257v8.252c.002.17.134.31.305.324h2.579A2.397 2.397 0 0 0 24 12.046a2.396 2.396 0 0 0-2.394-2.399"/></svg>
            </a>
            <a href="https://github.com/roneni" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-text-secondary transition-colors hover:text-[#84cc16]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <a href="https://peerlist.io/brainstorm" target="_blank" rel="noopener noreferrer" aria-label="Peerlist" className="text-text-secondary transition-colors hover:text-[#84cc16]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 2h8a6 6 0 0 1 0 12H8v8H6V2Zm2 2v8h6a4 4 0 0 0 0-8H8Z"/></svg>
            </a>
            <a href="https://ronenkatz.dev" target="_blank" rel="noopener noreferrer" aria-label="ronenkatz.dev" className="text-text-secondary transition-colors hover:text-[#84cc16]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/></svg>
            </a>
          </div>
          {/* Copyright & privacy */}
          <div className="flex items-center justify-center gap-4">
            <span>&copy; {year} HarmonySet. Built with care for the DJ community.</span>
            <span className="text-text-secondary/30">|</span>
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
