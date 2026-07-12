"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Leaf,
  ShoppingCart,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export default function EnvironmentalGoals() {
  const [purchaseType, setPurchaseType] = useState("paper")
  const [itemQuantity, setItemQuantity] = useState(50)
  const [isNudgeOpen, setIsNudgeOpen] = useState(false)
  const [isOrdered, setIsOrdered] = useState(false)
  const [selectedAlternative, setSelectedAlternative] = useState(false)
  const [goalsProgress, setGoalsProgress] = useState({
    emissions: 78,
    waste: 45,
    energy: 92,
  })

  // Items definition for simulator
  const items: Record<
    string,
    {
      name: string
      co2: number
      price: number
      alternative: string
      altCo2: number
      altPrice: number
      altName: string
    }
  > = {
    paper: {
      name: "Standard Virgin Pulp Copy Paper (A4)",
      co2: 0.8, // kg per box
      price: 25,
      altName: "100% Post-Consumer Recycled Copy Paper",
      alternative: "recycled",
      altCo2: 0.2,
      altPrice: 22,
    },
    travel: {
      name: "Short-Haul Commercial Flight (NYC to BOS)",
      co2: 145, // kg
      price: 180,
      altName: "High-Speed Rail Travel ticket (Electric)",
      alternative: "train",
      altCo2: 12,
      altPrice: 130,
    },
    it: {
      name: "Standard Workstation PC & Monitor (Brand New)",
      co2: 320, // kg manufacturing footprint
      price: 950,
      altName: "Refurbished Energy-Star Workstation & Monitor",
      alternative: "refurbished",
      altCo2: 85,
      altPrice: 620,
    },
  }

  const activeItem = items[purchaseType]
  const currentTotalCo2 = activeItem.co2 * (itemQuantity / 10)
  const alternativeTotalCo2 = activeItem.altCo2 * (itemQuantity / 10)
  const co2Saved = Math.max(0, currentTotalCo2 - alternativeTotalCo2)
  const costDifference = activeItem.price * itemQuantity - activeItem.altPrice * itemQuantity

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    // Open the nudge popup if they haven't opted for the green alternative
    if (!selectedAlternative) {
      setIsNudgeOpen(true)
    } else {
      triggerPurchaseSuccess(true)
    }
  }

  const triggerPurchaseSuccess = (isAlternative: boolean) => {
    if (isAlternative) {
      toast.success("Green Purchase Order Completed!", {
        description: `Opted for "${activeItem.altName}". Saved ${co2Saved.toFixed(1)}kg CO2! +50 XP Awarded.`,
      })
      // Dynamically improve environmental goals progress
      setGoalsProgress((prev) => ({
        ...prev,
        emissions: Math.min(100, prev.emissions + 2),
      }))
    } else {
      toast.warning("Purchase Order Completed", {
        description: `Order processed for "${activeItem.name}".`,
      })
    }
    setIsOrdered(true)
    setIsNudgeOpen(false)
  }

  const resetSimulator = () => {
    setIsOrdered(false)
    setSelectedAlternative(false)
    setIsNudgeOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Environmental Management</h1>
        <p className="text-slate-400 mt-2">
          Track organization-wide environmental metrics and test real-time ERP Green Nudging tools.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left/Middle: Environmental Goals */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle>Core ESG Environmental Goals</CardTitle>
              <CardDescription>Targets, milestones, and actual progress tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableHead>Target Initiative</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium">Reduce Scope 1 & 2 CO2 Emissions by 20%</TableCell>
                    <TableCell>Dec 2026</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Progress value={goalsProgress.emissions} className="w-[100px]" />
                        <span className="text-sm text-slate-400">{goalsProgress.emissions}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium">Zero Solid Waste to Landfill</TableCell>
                    <TableCell>Dec 2027</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Progress value={goalsProgress.waste} className="w-[100px]" />
                        <span className="text-sm text-slate-400">{goalsProgress.waste}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium">100% Renewable Electricity Sourcing</TableCell>
                    <TableCell>Jan 2030</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Progress value={goalsProgress.energy} className="w-[100px]" />
                        <span className="text-sm text-slate-400">{goalsProgress.energy}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium">Water Usage Reduction (15% reduction)</TableCell>
                    <TableCell>Jun 2025</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Progress value={100} className="w-[100px]" />
                        <span className="text-sm text-slate-400">100%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-500 text-slate-400">Completed</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Interactive ERP Green Nudging Simulator */}
          <Card className="border-slate-800 bg-slate-900/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 rounded-bl-lg border-l border-b border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 text-xs font-semibold">
              <Sparkles className="size-3" /> Live Innovation
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-5 text-primary" />
                ERP Procurement & Green Nudging Simulator
              </CardTitle>
              <CardDescription>
                Experience real-time behavioral nudging integrated into company procurement workflows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isOrdered ? (
                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="purchaseType">Purchase Requisition Category</Label>
                      <select
                        id="purchaseType"
                        value={purchaseType}
                        onChange={(e) => {
                          setPurchaseType(e.target.value)
                          setSelectedAlternative(false)
                        }}
                        className="w-full h-9 rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="paper">Office Supplies (Paper)</option>
                        <option value="travel">Corporate Travel (Air/Rail)</option>
                        <option value="it">IT Hardware (Workstations)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity / Units</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="1000"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(Number(e.target.value))}
                        className="bg-slate-950 border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Selected Item:</span>
                      <span className="font-medium text-right max-w-[70%]">
                        {selectedAlternative ? activeItem.altName : activeItem.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Estimated Cost:</span>
                      <span className="font-semibold">
                        ${(
                          (selectedAlternative ? activeItem.altPrice : activeItem.price) * itemQuantity
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Projected Carbon Footprint:</span>
                      <span className={`font-semibold ${selectedAlternative ? "text-emerald-400" : "text-amber-500"}`}>
                        {((selectedAlternative ? activeItem.altCo2 : activeItem.co2) * (itemQuantity / 10)).toFixed(1)} kg CO₂e
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="optAlt"
                      checked={selectedAlternative}
                      onChange={(e) => setSelectedAlternative(e.target.checked)}
                      className="size-4 rounded border-slate-800 text-primary bg-slate-950 focus:ring-primary"
                    />
                    <Label htmlFor="optAlt" className="text-xs text-slate-300 cursor-pointer">
                      Opt for the green alternative beforehand (Skip Nudge Trigger)
                    </Label>
                  </div>

                  <Button type="submit" className="w-full">
                    Generate Purchase Order (PO)
                  </Button>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
                  <CheckCircle className="size-12 mx-auto text-emerald-500" />
                  <div>
                    <h3 className="text-lg font-bold">Purchase Requisition Generated</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      The purchase requisition has been compiled and routed for managerial approval.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={resetSimulator}>
                      Try Simulator Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: High-Impact Explanation */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-400">
                <Leaf className="size-5" />
                What is Green Nudging?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>
                <strong>EcoSphere's Green Nudging</strong> integrates carbon footprint intelligence directly into daily enterprise software workflows (like ERPs and travel platforms).
              </p>
              <p>
                Instead of simply reporting emissions after they occur, the platform acts as an active constraint and helper:
              </p>
              <ul className="list-disc pl-4 space-y-2 text-slate-400 text-xs">
                <li>Analyzes choices in real-time.</li>
                <li>Displays cost vs. carbon delta.</li>
                <li>Leverages department carbon caps as behavioral constraints.</li>
                <li>Awards gamified XP (+50 XP) to reward corporate compliance.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* The Nudge Overlay Modal */}
      {isNudgeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="max-w-md w-full border-emerald-500/30 bg-slate-900 shadow-2xl relative">
            <div className="absolute top-0 right-0 p-3 text-emerald-400 flex items-center gap-1 text-xs">
              <Leaf className="size-4 animate-bounce" /> Eco-Alert
            </div>
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl flex items-center gap-2 text-emerald-400">
                <AlertTriangle className="size-5 text-amber-500" />
                EcoSphere Green Nudge
              </CardTitle>
              <CardDescription>
                We noticed you are ordering a carbon-intensive item.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="text-slate-300">
                  By switching your requisition to <strong className="text-white">"{activeItem.altName}"</strong>:
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-center">
                    <span className="block text-xs text-slate-400">Carbon Savings</span>
                    <span className="text-lg font-bold text-emerald-400">-{co2Saved.toFixed(1)} kg CO₂</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs text-slate-400">Savings Cost</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {costDifference >= 0 ? `$${costDifference.toLocaleString()}` : `-$${Math.abs(costDifference)}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-emerald-950/30 border border-emerald-500/20 rounded-md text-xs text-emerald-300">
                <CheckCircle className="size-4 shrink-0 text-emerald-500" />
                <span>Applying this alternative will keep your department under its Q3 Emissions Cap!</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 bg-slate-950 border-t border-slate-800 p-4 rounded-b-xl">
              <Button
                onClick={() => {
                  setSelectedAlternative(true)
                  triggerPurchaseSuccess(true)
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5"
              >
                Apply Green Alternative (+50 XP) <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => triggerPurchaseSuccess(false)}
                className="w-full text-slate-400 hover:text-white"
              >
                Proceed anyway (Ignore Nudge)
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
