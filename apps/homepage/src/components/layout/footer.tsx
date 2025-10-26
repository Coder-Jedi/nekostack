import Link from 'next/link'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">N</span>
                </div>
                <span className="font-bold">NekoStack</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A comprehensive SaaS suite providing essential tools for productivity and creativity.
              </p>
            </div>

            {/* Tools */}
            <div className="space-y-4">
              <h3 className="font-semibold">Tools</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/tools/image-compressor" className="text-muted-foreground hover:text-primary transition-colors">
                    Image Compressor
                  </Link>
                </li>
                <li>
                  <Link href="/tools/qr-generator" className="text-muted-foreground hover:text-primary transition-colors">
                    QR Generator
                  </Link>
                </li>
                <li>
                  <Link href="/tools/markdown-editor" className="text-muted-foreground hover:text-primary transition-colors">
                    Markdown Editor
                  </Link>
                </li>
                <li>
                  <Link href="/tools/unit-converter" className="text-muted-foreground hover:text-primary transition-colors">
                    Unit Converter
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="text-muted-foreground hover:text-primary transition-colors">
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-muted-foreground hover:text-primary transition-colors">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div className="space-y-4">
              <h3 className="font-semibold">Connect</h3>
              <div className="flex space-x-4">
                <Link href="https://github.com/nekostack" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link href="https://twitter.com/nekostack" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="mailto:support@nekostack.com" className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2025 NekoStack. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground flex items-center mt-2 sm:mt-0">
                Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for productivity
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
