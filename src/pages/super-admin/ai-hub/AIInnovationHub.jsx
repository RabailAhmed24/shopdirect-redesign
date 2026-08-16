import { useState } from "react";
import {
  Archive,
  TrendingUp,
  Network,
  Truck,
  RotateCcw,
  ShieldCheck,
  Landmark,
  Headphones,
  Sparkles,
  BarChart3,
  AudioLines,
  MessageSquareText,
  Boxes,
  BrainCircuit,
  Layers3,
  X,
  Circle,
  ArrowUpRight,
  ChevronDown,
  Bell,
  Check,
} from "lucide-react";

import "../../../styles/ai-innovation-hub.css";

const modules = [
  {
    id: "01",
    category: "inventory",
    title: "AI Inventory Forecasting System",
    short: "Predict demand and optimize stock levels with AI.",
    overview:
      "Advanced AI-powered forecasting to predict inventory needs and optimize stock levels.",
    icon: Archive,
    capabilities: [
      "Predict stock outs",
      'Auto "next purchase quantity" suggest',
      "Identify fast/slow-moving SKUs",
      "Multi-seller forecasting",
    ],
  },
  {
    id: "02",
    category: "revenue",
    title: "Dynamic Pricing / Repricer Engine",
    short: "Optimize pricing using market and demand intelligence.",
    overview:
      "Automatically adjust prices based on market conditions, competition, and demand patterns.",
    icon: TrendingUp,
    capabilities: [
      "AI calculates selling price",
      "Automatic price optimisation",
      "Margin protection",
      "Competitor price matching",
    ],
  },
  {
    id: "03",
    category: "inventory",
    title: "Multi-Channel Inventory System",
    short: "Keep inventory synchronized across every sales channel.",
    overview:
      "Synchronize inventory across multiple sales channels in real-time with AI optimization.",
    icon: Network,
    capabilities: [
      "Amazon/eBay/Shopify/TikTok stock sync",
      "Unified dashboard",
      "Sales by seller/manager",
    ],
  },
  {
    id: "04",
    category: "inventory",
    title: "AI Label Automation System",
    short: "Automate and optimize shipping label generation.",
    overview:
      "Automatically generate and optimize shipping labels using AI-powered address validation.",
    icon: Truck,
    capabilities: [
      "Auto weight prediction (AI)",
      "Auto carrier selection",
      "Bulk PDF label generation",
      "Error detection for invalid addresses",
    ],
  },
  {
    id: "05",
    category: "commerce",
    title: "AI Returns & Refunds Automation",
    short: "Streamline returns, refunds and fraud detection.",
    overview:
      "Intelligent automation for processing returns and refunds with fraud detection.",
    icon: RotateCcw,
    capabilities: [
      "Detect refund fraud",
      "Categorize refund reasons",
      "Track return rate per SKU",
      "Auto-generate restock request",
      'Predict "return risk score"',
    ],
  },
  {
    id: "06",
    category: "inventory",
    title: "Warehouse Loss & Shrinkage AI Detector",
    short: "Detect inventory loss patterns before they impact operations.",
    overview:
      "AI-powered detection system to identify and prevent inventory shrinkage and losses.",
    icon: ShieldCheck,
    capabilities: [
      "Loss patterns detection",
      "Theft indicators",
      "Damaged items prediction",
      "Seller-level loss analytics",
    ],
  },
  {
    id: "07",
    category: "revenue",
    title: "Payout & Commission Reconciliation",
    short: "Automate seller payouts and commission reconciliation.",
    overview:
      "Automatically reconcile payouts and commissions with AI-powered accuracy checks.",
    icon: Landmark,
    capabilities: [
      "Automated seller commissions",
      "Payout predictions",
      "Fraud detection",
      "Deduction automation (returns, loss, postage)",
    ],
  },
  {
    id: "08",
    category: "customer",
    title: "AI Customer Support Chatbot",
    short: "24/7 intelligent assistance for everyday customer requests.",
    overview:
      "AI chatbot for order tracking, refunds, and customer support with natural language processing.",
    icon: Headphones,
    capabilities: [
      '"Where is my order?"',
      '"Refund status?"',
      '"Send invoice"',
      '"Generate return label"',
      '"Stock availability"',
    ],
  },
  {
    id: "09",
    category: "commerce",
    title: "AI Listing Generator + Optimizer",
    short: "Create optimized product listings with AI.",
    overview:
      "Generate and optimize product listings with AI for better visibility and conversions.",
    icon: Sparkles,
    capabilities: [
      "Generate eBay/Amazon titles",
      "Create SEO descriptions",
      "Auto-detect missing item specifics",
      "Fix image quality",
      "Create TikTok Shop listing templates",
    ],
  },
  {
    id: "10",
    category: "revenue",
    title: "Profit Analytics & AI Reporting Suite",
    short: "Turn business data into predictive profit insights.",
    overview:
      "Comprehensive AI-powered analytics and reporting for profit optimization and forecasting.",
    icon: BarChart3,
    capabilities: [
      "Daily profit",
      "Seller-level performance",
      "Manager-level commission report",
      "Inventory ageing",
      "SKU profitability score",
      "Predict next month sales",
    ],
  },
  {
    id: "11",
    category: "customer",
    title: "AI Voice Agent",
    short: "Voice-powered assistance for customers and operations.",
    overview:
      "Interactive voice agent for hands-free operations and voice-activated commands.",
    icon: AudioLines,
    capabilities: [
      "24/7 Customer Support Calls",
      "Handles order tracking, delivery issues, returns, refunds, and general FAQs",
      "AI Sales Assistant — Recommends products",
      "Automated Order Status Calls",
      "Multi-Language Support — English, Urdu, Hindi, Arabic",
      "Ultra-Realistic Conversational Voice",
    ],
  },
  {
    id: "12",
    category: "customer",
    title: "Chat Bot",
    short: "Conversational AI for commerce and business automation.",
    overview:
      "Advanced conversational AI chatbot for customer interactions and business automation.",
    icon: MessageSquareText,
    capabilities: [
      "Instant Order Lookup",
      "Smart Product Recommendations",
      "Automated Returns & Refunds",
      "Cart Recovery Automation",
      "Stock Alerts, Price Alerts & Promotions",
      "Website + WhatsApp + App Integration",
    ],
  },
];

const categories = [
  {
    id: "inventory",
    title: "Inventory & Operations",
    description:
      "Optimize stock, fulfilment and warehouse operations with intelligent automation.",
    icon: Boxes,
  },
  {
    id: "revenue",
    title: "Revenue & Finance",
    description:
      "Improve profitability, payouts and financial visibility with AI-powered intelligence.",
    icon: TrendingUp,
  },
  {
    id: "customer",
    title: "Customer Experience",
    description:
      "Enhance support and engagement through intelligent conversational tools.",
    icon: Headphones,
  },
  {
    id: "commerce",
    title: "Commerce Intelligence",
    description:
      "Optimize listings, returns and commerce workflows using AI insights.",
    icon: Sparkles,
  },
];

function AIInnovationHub() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [isNotified, setIsNotified] = useState(false);

  function toggleCategory(categoryId) {
    setOpenCategory((current) =>
      current === categoryId ? null : categoryId
    );
  }

  function openModule(module) {
    setSelectedModule(module);
    setIsNotified(false);
  }

  function closeModal() {
    setSelectedModule(null);
    setIsNotified(false);
  }

  function handleNotify() {
    if (!selectedModule || isNotified) return;

    console.log("AI module interest", { moduleId: selectedModule.id });
    setIsNotified(true);
  }

  return (
    <div className="ai-hub-page">
      {/* PAGE HEADER */}
      <section className="ai-hub-heading">
        <div>
          <p className="ai-hub-eyebrow">SUPER ADMIN</p>

          <h1>AI Innovation Hub</h1>

          <p className="ai-hub-description">
            Intelligent tools built to automate, optimize and scale ShopDirect.
          </p>
        </div>

        <div className="ai-hub-heading-icon">
          <BrainCircuit size={27} strokeWidth={1.8} />
        </div>
      </section>

      {/* AI DEVELOPMENT BANNER */}
      <section className="ai-development-banner">
        <div className="ai-development-banner-icon">
          <Sparkles size={22} strokeWidth={1.9} />
        </div>

        <div className="ai-development-banner-copy">
          <span>AI MODULES</span>
          <strong>Built for what’s next.</strong>
          <p>
            Smart tools designed to automate and optimize ShopDirect operations.
          </p>
        </div>
      </section>

      {/* SUMMARY CARDS */}
      <section className="ai-hub-summary">
        <div className="ai-summary-item ai-summary-purple">
          <span className="ai-summary-icon">
            <Boxes size={20} strokeWidth={1.9} />
          </span>

          <div>
            <strong>12</strong>
            <span>AI Modules</span>
          </div>
        </div>

        <div className="ai-summary-item ai-summary-blue">
          <span className="ai-summary-icon">
            <Layers3 size={20} strokeWidth={1.9} />
          </span>

          <div>
            <strong>4</strong>
            <span>Categories</span>
          </div>
        </div>

        <div className="ai-summary-item ai-summary-green">
          <span className="ai-summary-icon">
            <Sparkles size={20} strokeWidth={1.9} />
          </span>

          <div>
            <strong>Q1 2027</strong>
            <span>Est. Rollout</span>
          </div>
        </div>
      </section>

      {/* ACCORDION CATEGORIES */}
      <div className="ai-hub-categories">
        {categories.map((category) => {
          const CategoryIcon = category.icon;

          const categoryModules = modules.filter(
            (module) => module.category === category.id
          );

          const isOpen = openCategory === category.id;

          return (
            <section
              key={category.id}
              className={`ai-category ai-category-${category.id} ${
                isOpen ? "ai-category-open" : ""
              }`}
            >
              <button
                type="button"
                className="ai-category-trigger"
                onClick={() => toggleCategory(category.id)}
                aria-expanded={isOpen}
              >
                <span className="ai-category-icon">
                  <CategoryIcon size={22} strokeWidth={1.9} />
                </span>

                <span className="ai-category-copy">
                  <strong>{category.title}</strong>

                  <span>{category.description}</span>
                </span>

                <span className="ai-category-actions">
                  <span className="ai-category-count">
                    {categoryModules.length} modules
                  </span>

                  <span className="ai-category-chevron">
                    <ChevronDown size={19} />
                  </span>
                </span>
              </button>

              <div className="ai-category-content">
                <div className="ai-category-content-inner">
                  <div className="ai-module-grid">
                    {categoryModules.map((module) => {
                      const ModuleIcon = module.icon;

                      return (
                        <button
                          type="button"
                          className="ai-module"
                          key={module.id}
                          onClick={() => openModule(module)}
                        >
                          <div className="ai-module-top">
                            <span className="ai-module-icon">
                              <ModuleIcon size={19} strokeWidth={1.9} />
                            </span>
                          </div>

                          <h3>{module.title}</h3>

                          <p>{module.short}</p>

                          <div className="ai-module-footer">
                            <span>
                              {module.capabilities.length} planned capabilities
                            </span>

                            <span className="ai-module-details">
                              View details
                              <ArrowUpRight size={15} />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* DETAILS MODAL */}
      {selectedModule && (
        <div
          className="ai-modal-overlay"
          onMouseDown={closeModal}
        >
          <div
            className={`ai-modal ai-modal-${selectedModule.category}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ai-modal-header">
              <div className="ai-modal-title-wrap">
                <span className="ai-modal-icon">
                  {(() => {
                    const Icon = selectedModule.icon;
                    return <Icon size={23} />;
                  })()}
                </span>

                <div>
                  <h2>{selectedModule.title}</h2>

                  <p>{selectedModule.short}</p>
                </div>
              </div>

              <button
                type="button"
                className="ai-modal-close-icon"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <div className="ai-modal-body">
              <div className="ai-modal-overview">
                <span>OVERVIEW</span>

                <p>{selectedModule.overview}</p>
              </div>

              <div className="ai-modal-capabilities-header">
                <h3>PLANNED CAPABILITIES</h3>

                <span>{selectedModule.capabilities.length}</span>
              </div>

              <div className="ai-modal-capabilities">
                {selectedModule.capabilities.map((capability) => (
                  <div
                    className="ai-capability"
                    key={capability}
                  >
                    <Circle
                      size={10}
                      strokeWidth={2}
                    />

                    <span>{capability}</span>
                  </div>
                ))}
              </div>

              {isNotified && (
                <div className="ai-notify-message">
                  <Check size={15} />
                  <span>We'll notify you when this module goes live.</span>
                </div>
              )}
            </div>

            <div className="ai-modal-footer">
              <span>
                Available in an upcoming release
              </span>

              <div className="ai-modal-footer-actions">
                <button
                  type="button"
                  className={`ai-notify-button ${
                    isNotified ? "ai-notify-button-active" : ""
                  }`}
                  onClick={handleNotify}
                  disabled={isNotified}
                >
                  {isNotified ? (
                    <>
                      <Check size={14} />
                      Notified
                    </>
                  ) : (
                    <>
                      <Bell size={14} />
                      Notify Me
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="ai-close-button"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIInnovationHub;