import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Bookmark, ExternalLink, Filter, CheckCircle, Clock, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const schemes = [
  {
    id: 1,
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description: "Financial assistance of ₹6000 per year to all farmer families having cultivable land",
    state: "All India",
    category: "Direct Income Support",
    eligibility: "Farmers with cultivable land",
    amount: "₹6,000/year",
    documents: ["Land records", "Aadhaar card", "Bank account details"],
    applicationLink: "https://pmkisan.gov.in/",
    status: "active",
    bookmarked: false,
  },
  {
    id: 2,
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Crop insurance scheme to protect farmers against crop loss due to natural calamities",
    state: "All India",
    category: "Insurance",
    eligibility: "All farmers growing notified crops",
    amount: "Variable premium",
    documents: ["Land records", "Sowing certificate", "Aadhaar card"],
    applicationLink: "https://pmfby.gov.in/",
    status: "active",
    bookmarked: true,
  },
  {
    id: 3,
    title: "Soil Health Card Scheme",
    description: "Free soil testing and health cards to help farmers improve soil quality and crop yields",
    state: "All India",
    category: "Soil Management",
    eligibility: "All farmers",
    amount: "Free service",
    documents: ["Land records", "Farmer ID"],
    applicationLink: "https://soilhealth.dac.gov.in/",
    status: "active",
    bookmarked: false,
  },
  {
    id: 4,
    title: "Maharashtra Agri Business Scheme",
    description: "Subsidy for agricultural equipment and modernization",
    state: "Maharashtra",
    category: "Equipment Subsidy",
    eligibility: "Small and marginal farmers in Maharashtra",
    amount: "Up to 50% subsidy",
    documents: ["Land records", "Income certificate", "Farmer certificate"],
    applicationLink: "#",
    status: "active",
    bookmarked: false,
  },
  {
    id: 5,
    title: "Kisan Credit Card (KCC)",
    description: "Credit facility for farmers to meet short term credit requirements for cultivation",
    state: "All India",
    category: "Credit",
    eligibility: "Farmers, tenant farmers, sharecroppers",
    amount: "Based on land holding",
    documents: ["Land documents", "Identity proof", "Address proof"],
    applicationLink: "#",
    status: "active",
    bookmarked: false,
  },
  {
    id: 6,
    title: "National Mission for Sustainable Agriculture",
    description: "Promoting sustainable agricultural practices and climate resilient farming",
    state: "All India",
    category: "Sustainable Farming",
    eligibility: "Progressive farmers and farmer groups",
    amount: "Variable grants",
    documents: ["Farmer ID", "Project proposal", "Land records"],
    applicationLink: "#",
    status: "active",
    bookmarked: true,
  },
];

const Schemes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<number[]>([2, 6]);
  const [selectedScheme, setSelectedScheme] = useState<typeof schemes[0] | null>(null);
  const { toast } = useToast();

  const handleBookmark = (schemeId: number) => {
    setBookmarkedSchemes(prev => 
      prev.includes(schemeId)
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId]
    );
    toast({
      title: bookmarkedSchemes.includes(schemeId) ? "Removed from bookmarks" : "Added to bookmarks",
      description: "Your bookmarks have been updated",
    });
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === "all" || scheme.state === selectedState;
    const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory;
    return matchesSearch && matchesState && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Government Schemes</h1>
          <p className="text-muted-foreground">
            Discover agricultural subsidies, programs, and benefits available for farmers
          </p>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search" className="sr-only">Search schemes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search schemes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="state" className="sr-only">Filter by state</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="All India">All India</SelectItem>
                  <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                  <SelectItem value="Assam">Assam</SelectItem>
                  <SelectItem value="Bihar">Bihar</SelectItem>
                  <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                  <SelectItem value="Goa">Goa</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Haryana">Haryana</SelectItem>
                  <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                  <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Kerala">Kerala</SelectItem>
                  <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Manipur">Manipur</SelectItem>
                  <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                  <SelectItem value="Mizoram">Mizoram</SelectItem>
                  <SelectItem value="Nagaland">Nagaland</SelectItem>
                  <SelectItem value="Odisha">Odisha</SelectItem>
                  <SelectItem value="Punjab">Punjab</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="Sikkim">Sikkim</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Telangana">Telangana</SelectItem>
                  <SelectItem value="Tripura">Tripura</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                  <SelectItem value="West Bengal">West Bengal</SelectItem>
                  <SelectItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</SelectItem>
                  <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                  <SelectItem value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                  <SelectItem value="Ladakh">Ladakh</SelectItem>
                  <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
                  <SelectItem value="Puducherry">Puducherry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category" className="sr-only">Filter by category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Direct Income Support">Direct Income Support</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Crop Insurance">Crop Insurance</SelectItem>
                  <SelectItem value="Equipment Subsidy">Equipment Subsidy</SelectItem>
                  <SelectItem value="Credit">Credit</SelectItem>
                  <SelectItem value="Loan Scheme">Loan Scheme</SelectItem>
                  <SelectItem value="Soil Management">Soil Management</SelectItem>
                  <SelectItem value="Sustainable Farming">Sustainable Farming</SelectItem>
                  <SelectItem value="Organic Farming">Organic Farming</SelectItem>
                  <SelectItem value="Irrigation">Irrigation</SelectItem>
                  <SelectItem value="Water Management">Water Management</SelectItem>
                  <SelectItem value="Seeds & Fertilizers">Seeds & Fertilizers</SelectItem>
                  <SelectItem value="Horticulture">Horticulture</SelectItem>
                  <SelectItem value="Animal Husbandry">Animal Husbandry</SelectItem>
                  <SelectItem value="Dairy Development">Dairy Development</SelectItem>
                  <SelectItem value="Fisheries">Fisheries</SelectItem>
                  <SelectItem value="Marketing Support">Marketing Support</SelectItem>
                  <SelectItem value="Cold Storage">Cold Storage</SelectItem>
                  <SelectItem value="Food Processing">Food Processing</SelectItem>
                  <SelectItem value="Training & Education">Training & Education</SelectItem>
                  <SelectItem value="Farmer Welfare">Farmer Welfare</SelectItem>
                  <SelectItem value="Women Farmer Scheme">Women Farmer Scheme</SelectItem>
                  <SelectItem value="Precision Farming">Precision Farming</SelectItem>
                  <SelectItem value="Climate Resilient Agriculture">Climate Resilient Agriculture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredSchemes.length} schemes found
            </span>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-heading font-bold mb-2">{scheme.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">{scheme.state}</Badge>
                    <Badge variant="outline">{scheme.category}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleBookmark(scheme.id)}
                >
                  <Bookmark
                    className={`h-5 w-5 ${bookmarkedSchemes.includes(scheme.id) ? "fill-primary text-primary" : ""}`}
                  />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{scheme.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Eligibility:</span>
                  <span className="font-medium">{scheme.eligibility}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{scheme.amount}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedScheme(scheme)}>
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{selectedScheme?.title}</DialogTitle>
                      <DialogDescription>
                        Complete information and application details
                      </DialogDescription>
                    </DialogHeader>
                    {selectedScheme && (
                      <div className="space-y-6 py-4">
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">{selectedScheme.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">State</h4>
                            <Badge variant="outline">{selectedScheme.state}</Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Category</h4>
                            <Badge variant="outline">{selectedScheme.category}</Badge>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Eligibility</h4>
                          <p className="text-sm text-muted-foreground">{selectedScheme.eligibility}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Financial Benefit</h4>
                          <p className="text-sm font-medium">{selectedScheme.amount}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Required Documents</h4>
                          <ul className="space-y-2">
                            {selectedScheme.documents.map((doc, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 border-t">
                          <Button className="w-full" asChild>
                            <a href={selectedScheme.applicationLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Apply Now
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button className="flex-1" asChild>
                  <a href={scheme.applicationLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Apply
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No schemes found matching your criteria</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Schemes;
