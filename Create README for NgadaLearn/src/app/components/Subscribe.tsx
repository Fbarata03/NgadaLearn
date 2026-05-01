import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Check,
  CreditCard,
  Shield,
  Zap,
  Globe,
  Award,
  Lock,
  X,
} from "lucide-react";

export function Subscribe() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleSubscribe = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("🎉 Subscription successful! Welcome to NgadaLearn Premium!");
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Start Your Fluency Journey
          </h1>
          <p className="text-xl text-gray-600">
            Join thousands of learners worldwide for just US$ 5/month
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pricing Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Premium Access</h2>
                  <p className="text-gray-600">All features • Unlimited lessons • Cancel anytime</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    $5
                  </div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Unlimited Lessons</p>
                    <p className="text-sm text-gray-600">Access to all conversation, audio, and vocabulary exercises</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">NgadaFlow Audio</p>
                    <p className="text-sm text-gray-600">Advanced listening practice with multiple accents</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Progress Dashboard</p>
                    <p className="text-sm text-gray-600">Track your improvement with detailed analytics</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Certificates</p>
                    <p className="text-sm text-gray-600">Earn certificates as you complete levels</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">No Ads Ever</p>
                    <p className="text-sm text-gray-600">Pure learning experience without interruptions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Mobile & Desktop</p>
                    <p className="text-sm text-gray-600">Learn anywhere on any device</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg py-6"
                onClick={() => setShowPaymentForm(true)}
              >
                Subscribe Now - US$ 5/month
              </Button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Cancel anytime • No hidden fees • Secure payment via Stripe
              </p>
            </Card>

            {/* Payment Form */}
            {showPaymentForm && (
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Payment Information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPaymentForm(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        className="pl-10"
                      />
                      <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Demo mode: Use 4242 4242 4242 4242 for testing
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" maxLength={3} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Cardholder Name</Label>
                    <Input id="name" placeholder="Your Name" />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-4 bg-gray-50 rounded-lg px-4">
                    <span className="font-medium">Total due today</span>
                    <span className="text-2xl font-bold">US$ 5.00</span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Confirm Payment - US$ 5.00
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By confirming, you agree to our Terms of Service and Privacy Policy.
                    Your subscription will renew automatically each month.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Secure Payment
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your payment information is encrypted and secure. We use Stripe,
                the industry leader in online payment processing.
              </p>
              <div className="flex gap-2 flex-wrap">
                <div className="px-3 py-1 bg-gray-100 rounded text-xs">🔒 SSL Encrypted</div>
                <div className="px-3 py-1 bg-gray-100 rounded text-xs">💳 PCI Compliant</div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="font-bold mb-4">Why US$ 5?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong>Global Access:</strong> Affordable for students worldwide
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong>No Compromises:</strong> Full premium features included
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <strong>Best Value:</strong> Less than a coffee for 30 days of learning
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-1">Can I cancel anytime?</p>
                  <p className="text-gray-600">
                    Yes! Cancel your subscription anytime with one click. No questions asked.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">Is there a free trial?</p>
                  <p className="text-gray-600">
                    Yes! Your first 7 days are free. Cancel before then and pay nothing.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">What payment methods do you accept?</p>
                  <p className="text-gray-600">
                    We accept all major credit cards, debit cards, and digital wallets via Stripe.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-green-50 border-2 border-green-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🎁</div>
                <h4 className="font-bold mb-2">Limited Offer</h4>
                <p className="text-sm text-gray-700">
                  Subscribe today and get your first month for just US$ 2.50!
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">Trusted by learners in over 50 countries</p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="w-5 h-5" />
              <span className="text-sm">Certified Content</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-5 h-5" />
              <span className="text-sm">50+ Countries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
