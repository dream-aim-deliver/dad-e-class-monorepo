Pricing & Savings Fields

## Use cases by type

### Course-level use cases

The following use cases add new pricing-related fields:

- getPublicCourseDetails
    
    Adds: coachingSessionsTotalPrice, savingsWithCoachings
    
- listCourses
    
    Adds: coachingSessionsTotalPrice and savingsWithCoachings (only when includeCoachingPrices = true)
    

### Package-level use cases

The following use cases add package pricing and savings fields:

- getCoursePackages
    
    Adds: coachingSessionsTotalPrice, savingsWithoutCoachings, savingsWithCoachings
    
- listOffersPagePackages
    
    Adds: coachingSessionsTotalPrice, savingsWithoutCoachings, savingsWithCoachings
    
- getPackageWithCourses
    
    Adds all course-level and package-level fields
    

---

## Field definitions

### Course fields

- basePrice (number)
    
    The course price without coaching.
    
- priceIncludingCoachings (number)
    
    The course price with coaching included.
    
- coachingSessionsTotalPrice (number or null)
    
    The total price of all coaching sessions if purchased separately.
    
- savingsWithCoachings (number or null)
    
    The savings on the coaching portion when buying the course with coaching.
    

Course formula

`savingsWithCoachings = coachingSessionsTotalPrice - (priceIncludingCoachings - basePrice)`

---

### Package fields

- price (number)
    
    Package price without coaching.
    
- priceWithCoachings (number)
    
    Package price with coaching included.
    
- coachingSessionsTotalPrice (number or null)
    
    Total price of all coaching sessions included in the package if bought separately.
    
- savingsWithoutCoachings (number)
    
    Savings compared to buying all courses individually without coaching.
    
- savingsWithCoachings (number)
    
    Total savings compared to buying courses and coaching separately.
    

### Package formulas

`savingsWithoutCoachings = sum of all course base prices - package price`

`savingsWithCoachings = (sum of all course base prices + sum of all coaching prices) - package priceWithCoachings`

---

## Example

There are 3 courses in a package:

- Course A: $100 base price + $50 coaching
- Course B: $100 base price + $80 coaching
- Course C: $100 base price + $70 coaching

If bought separately:

- Courses total: $300
- Coaching total: $200
- Grand total: $500

Package pricing:

- price (without coaching): $250
- priceWithCoachings: $350

Results:

- savingsWithoutCoachings = $300 - $250 = $50
- savingsWithCoachings = $300 + $200 - $350 = $150

---

Frontend display guide

- When the user buys a package without coaching:
    
    Display the price field and savingsWithoutCoachings.
    
- When the user buys a package with coaching:
    
    Display the priceWithCoachings field and savingsWithCoachings.
    

No frontend math is required. Display the values exactly as provided by the backend.