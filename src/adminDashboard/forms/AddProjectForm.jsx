import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { createOffer } from "../../services/offerService";
import { getAllCategories } from "../../services/categoryService";

export default function AddOffersForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    commission1: "", // mandatory
    commission1Comment: "", // comment for commission 1
    commission2: "", // optional
    commission2Comment: "", // comment for commission 2
    link: "",
    image: "",
    video: "",
    videoLink: "",
    termsAndConditions: ""
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getAllCategories({ 
        status: 'active',
        limit: 100,
        sortBy: 'name',
        order: 'asc'
      });
      
      if (response.success && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setErrorMessage("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if commission1 is filled
    if (!formData.commission1) {
      setErrorMessage("⚠️ Commission 1 is required!");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await createOffer(formData);
      
      if (response.success) {
        setSuccessMessage("✅ Offer created successfully!");
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({
            name: "",
            category: "",
            description: "",
            commission1: "",
            commission1Comment: "",
            commission2: "",
            commission2Comment: "",
            link: "",
            image: "",
            video: "",
            videoLink: "",
            termsAndConditions: ""
          });
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      setErrorMessage(error.response?.data?.message || "Failed to create offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Add New Offers</h2>
      
      {/* Alert Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
        </div>
      )}
      
      {/* Alert Message */}
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
              Bonus & Commission Information
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              <span className="font-medium">Total Bonus: ₹500</span> |{" "}
              <span className="font-medium ml-2">Per Task: ₹100</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-custom min-h-0">
      <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-4 sm:p-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Offer Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter offer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? "Loading categories..." : "Select Category"}
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Link</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com"
            />
          </div>

          {/* Commission 1 (Mandatory) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Commission 1 (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="commission1"
              value={formData.commission1}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 10"
              required
            />
            
            {/* Commission 1 Comment */}
            <div className="mt-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Commission 1 Comment
              </label>
              <textarea
                name="commission1Comment"
                value={formData.commission1Comment}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="e.g., From Amazon affiliate program offer"
                rows="2"
              />
            </div>
          </div>

          {/* Commission 2 (Optional) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Commission 2 (%) <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              name="commission2"
              value={formData.commission2}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 15"
            />
            
            {/* Commission 2 Comment */}
            <div className="mt-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Commission 2 Comment <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                name="commission2Comment"
                value={formData.commission2Comment}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="e.g., From Flipkart bonus offer"
                rows="2"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Offer Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter offer description..."
              required
            />
          </div>

          {/* Video Link */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Video Link</label>
            <input
              type="url"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          {/* Terms and Conditions */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Terms and Conditions</label>
            <textarea
              name="termsAndConditions"
              value={formData.termsAndConditions}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter terms and conditions..."
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Offer..." : "Add Offer"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: "",
                category: "",
                description: "",
                commission1: "",
                commission1Comment: "",
                commission2: "",
                commission2Comment: "",
                link: "",
                image: "",
                video: "",
                videoLink: "",
                termsAndConditions: ""
              });
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className="w-full sm:w-auto px-6 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/80 transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
