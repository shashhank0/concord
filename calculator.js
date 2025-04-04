// Form navigation and calculation logic
document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    const totalSteps = 6;
    
    // Show/hide spouse information based on marital status
    const maritalStatus = document.getElementById('marital-status');
    if (maritalStatus) {
        maritalStatus.addEventListener('change', function() {
            const spouseContainer = document.getElementById('spouse-container');
            if (this.value === 'married') {
                spouseContainer.style.display = 'block';
            } else {
                spouseContainer.style.display = 'none';
            }
        });
    }
    
    // Show/hide second language inputs
    const secondLanguage = document.getElementById('second-language');
    if (secondLanguage) {
        secondLanguage.addEventListener('change', function() {
            const secondLanguageContainer = document.getElementById('second-language-container');
            if (this.value === 'yes') {
                secondLanguageContainer.style.display = 'block';
            } else {
                secondLanguageContainer.style.display = 'none';
            }
        });
    }
    
    // Navigation functions
    window.nextStep = function(step) {
        if (validateStep(step)) {
            document.getElementById(`step-${step}`).classList.remove('active');
            document.getElementById(`step-${step+1}`).classList.add('active');
            
            // Update progress indicator
            const progressSteps = document.querySelectorAll('.progress-step');
            if (progressSteps.length > 0) {
                progressSteps[step-1].classList.remove('active');
                progressSteps[step-1].classList.add('completed');
                progressSteps[step].classList.add('active');
            }
            
            currentStep = step + 1;
            scrollToCalculator();
        }
    }
    
    window.prevStep = function(step) {
        document.getElementById(`step-${step}`).classList.remove('active');
        document.getElementById(`step-${step-1}`).classList.add('active');
        
        // Update progress indicator
        const progressSteps = document.querySelectorAll('.progress-step');
        if (progressSteps.length > 0) {
            progressSteps[step-1].classList.remove('active');
            progressSteps[step-2].classList.remove('completed');
            progressSteps[step-2].classList.add('active');
        }
        
        currentStep = step - 1;
        scrollToCalculator();
    }
    
    function scrollToCalculator() {
        const calculatorSection = document.getElementById('calculator');
        if (calculatorSection) {
            window.scrollTo({
                top: calculatorSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
    
    // Validation for each step
    function validateStep(step) {
        switch(step) {
            case 1:
                if (document.getElementById('program').value === '') {
                    alert('Please select an immigration program');
                    return false;
                }
                return true;
            case 2:
                if (document.getElementById('age').value === '') {
                    alert('Please enter your age');
                    return false;
                }
                if (document.getElementById('marital-status').value === '') {
                    alert('Please select your marital status');
                    return false;
                }
                return true;
            case 3:
                if (document.getElementById('education').value === '') {
                    alert('Please select your education level');
                    return false;
                }
                return true;
            case 4:
                if (document.getElementById('first-language').value === '') {
                    alert('Please select your language test');
                    return false;
                }
                if (document.getElementById('reading').value === '' || 
                    document.getElementById('writing').value === '' || 
                    document.getElementById('listening').value === '' || 
                    document.getElementById('speaking').value === '') {
                    alert('Please enter all language test scores');
                    return false;
                }
                return true;
            case 5:
            case 6:
                return true;
            default:
                return true;
        }
    }
    
    // Calculate points based on CRS criteria
    window.calculatePoints = function() {
        // Collect form data
        const formData = {
            age: parseInt(document.getElementById('age').value),
            maritalStatus: document.getElementById('marital-status').value,
            spouseComing: document.getElementById('spouse-coming') ? document.getElementById('spouse-coming').value : 'no',
            education: document.getElementById('education').value,
            canadianEducation: document.getElementById('canadian-education').value,
            languageTest: document.getElementById('first-language').value,
            reading: parseInt(document.getElementById('reading').value),
            writing: parseInt(document.getElementById('writing').value),
            listening: parseInt(document.getElementById('listening').value),
            speaking: parseInt(document.getElementById('speaking').value),
            canadianExperience: parseInt(document.getElementById('canadian-experience').value),
            foreignExperience: parseInt(document.getElementById('foreign-experience').value),
            nocSkillType: document.getElementById('noc-skill-type').value,
            provincialNomination: document.getElementById('provincial-nomination').value,
            jobOffer: document.getElementById('job-offer').value,
            canadianRelatives: document.getElementById('canadian-relatives').value
        };
        
        // Create calculator instance and calculate points
        const calculator = new CRSCalculator(formData);
        const results = calculator.calculate();
        const interpretation = calculator.interpretScore();
        const recommendations = calculator.generateRecommendations();
        
        // Update results display
        document.getElementById('total-score').textContent = results.total;
        document.getElementById('core-points').textContent = results.coreHumanCapital;
        document.getElementById('spouse-points').textContent = results.spouse;
        document.getElementById('skill-points').textContent = results.skillTransferability;
        document.getElementById('additional-points').textContent = results.additional;
        
        // Update interpretation
        const interpretationElement = document.getElementById('score-interpretation');
        interpretationElement.innerHTML = `
            <p>Your score is <strong>${interpretation.assessment}</strong>. ${interpretation.explanation}</p>
            <p>${interpretation.minScores}</p>
        `;
        
        // Update recommendations
        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = '<ul>' + recommendations.map(rec => `<li>${rec}</li>`).join('') + '</ul>';
        
        // Show results section
        document.getElementById('results-section').style.display = 'block';
        scrollToCalculator();
    }
    
    window.resetCalculator = function() {
        document.getElementById('points-calculator-form').reset();
        document.getElementById('results-section').style.display = 'none';
        const spouseContainer = document.getElementById('spouse-container');
        if (spouseContainer) spouseContainer.style.display = 'none';
        const secondLanguageContainer = document.getElementById('second-language-container');
        if (secondLanguageContainer) secondLanguageContainer.style.display = 'none';
        
        // Reset to first step
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById('step-1').classList.add('active');
        
        // Reset progress indicators
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === 0) step.classList.add('active');
        });
        
        currentStep = 1;
        scrollToCalculator();
    }
    
    window.downloadResults = function() {
        alert('In a complete implementation, this would generate a PDF with your results and recommendations.');
    }
});

// CRS Calculator Class
class CRSCalculator {
    constructor(formData) {
        this.formData = formData;
        this.results = {
            coreHumanCapital: 0,
            spouse: 0,
            skillTransferability: 0,
            additional: 0,
            total: 0
        };
    }

    calculate() {
        // Check if applicant has spouse/partner coming to Canada
        const hasSpouse = this.formData.maritalStatus === 'married' && this.formData.spouseComing === 'yes';
        
        // 1. Core/Human Capital Factors
        this.calculateCoreFactors(hasSpouse);
        
        // 2. Spouse Factors (if applicable)
        if (hasSpouse) {
            this.calculateSpouseFactors();
        }
        
        // 3. Skill Transferability Factors
        this.calculateSkillTransferability();
        
        // 4. Additional Points
        this.calculateAdditionalPoints();
        
        // Calculate total
        this.results.total = this.results.coreHumanCapital + 
                            this.results.spouse + 
                            this.results.skillTransferability + 
                            this.results.additional;
        
        // Maximum is 1200 points
        this.results.total = Math.min(this.results.total, 1200);
        
        return this.results;
    }
    
    calculateCoreFactors(hasSpouse) {
        let points = 0;
        const maxPoints = hasSpouse ? 460 : 500;
        let agePoints = 0;
        let educationPoints = 0;
        let languagePoints = 0;
        let canadianExperiencePoints = 0;
        
        // Age points (different scales for with/without spouse)
        const age = this.formData.age;
        if (hasSpouse) {
            // With spouse (max 100 points)
            if (age <= 17) agePoints = 0;
            else if (age >= 18 && age <= 35) agePoints = 100;
            else if (age === 36) agePoints = 95;
            else if (age === 37) agePoints = 90;
            else if (age === 38) agePoints = 85;
            else if (age === 39) agePoints = 80;
            else if (age === 40) agePoints = 75;
            else if (age === 41) agePoints = 70;
            else if (age === 42) agePoints = 65;
            else if (age === 43) agePoints = 60;
            else if (age === 44) agePoints = 55;
            else if (age === 45) agePoints = 50;
            else if (age === 46) agePoints = 45;
            else if (age === 47) agePoints = 35;
            else if (age === 48) agePoints = 25;
            else if (age === 49) agePoints = 15;
            else if (age >= 50) agePoints = 0;
        } else {
            // Without spouse (max 110 points)
            if (age <= 17) agePoints = 0;
            else if (age >= 18 && age <= 35) agePoints = 110;
            else if (age === 36) agePoints = 105;
            else if (age === 37) agePoints = 100;
            else if (age === 38) agePoints = 95;
            else if (age === 39) agePoints = 90;
            else if (age === 40) agePoints = 85;
            else if (age === 41) agePoints = 80;
            else if (age === 42) agePoints = 75;
            else if (age === 43) agePoints = 70;
            else if (age === 44) agePoints = 65;
            else if (age === 45) agePoints = 60;
            else if (age === 46) agePoints = 55;
            else if (age === 47) agePoints = 50;
            else if (age === 48) agePoints = 40;
            else if (age === 49) agePoints = 30;
            else if (age >= 50) agePoints = 0;
        }
        
        // Education points
        const education = this.formData.education;
        if (hasSpouse) {
            // With spouse (max 140 points)
            if (education === 'less-secondary') educationPoints = 0;
            else if (education === 'secondary') educationPoints = 28;
            else if (education === 'one-year') educationPoints = 84;
            else if (education === 'two-year') educationPoints = 91;
            else if (education === 'bachelors') educationPoints = 112;
            else if (education === 'two-or-more') educationPoints = 119;
            else if (education === 'masters') educationPoints = 126;
            else if (education === 'doctoral') educationPoints = 140;
        } else {
            // Without spouse (max 150 points)
            if (education === 'less-secondary') educationPoints = 0;
            else if (education === 'secondary') educationPoints = 30;
            else if (education === 'one-year') educationPoints = 90;
            else if (education === 'two-year') educationPoints = 98;
            else if (education === 'bachelors') educationPoints = 120;
            else if (education === 'two-or-more') educationPoints = 128;
            else if (education === 'masters') educationPoints = 135;
            else if (education === 'doctoral') educationPoints = 150;
        }
        
        // Language points (simplified - in a real implementation, would convert test scores to CLB levels)
        // Here we're assuming CLB 7+ for demonstration purposes
        const languageScore = this.calculateLanguagePoints();
        if (hasSpouse) {
            // With spouse (max 128 points)
            languagePoints = Math.min(languageScore, 128);
        } else {
            // Without spouse (max 136 points)
            languagePoints = Math.min(languageScore, 136);
        }
        
        // Canadian experience points
        const canadianExp = parseInt(this.formData.canadianExperience);
        if (hasSpouse) {
            // With spouse (max 70 points)
            if (canadianExp === 0) canadianExperiencePoints = 0;
            else if (canadianExp === 1) canadianExperiencePoints = 35;
            else if (canadianExp === 2) canadianExperiencePoints = 46;
            else if (canadianExp === 3) canadianExperiencePoints = 56;
            else if (canadianExp === 4) canadianExperiencePoints = 63;
            else if (canadianExp >= 5) canadianExperiencePoints = 70;
        } else {
            // Without spouse (max 80 points)
            if (canadianExp === 0) canadianExperiencePoints = 0;
            else if (canadianExp === 1) canadianExperiencePoints = 40;
            else if (canadianExp === 2) canadianExperiencePoints = 53;
            else if (canadianExp === 3) canadianExperiencePoints = 64;
            else if (canadianExp === 4) canadianExperiencePoints = 72;
            else if (canadianExp >= 5) canadianExperiencePoints = 80;
        }
        
        points = agePoints + educationPoints + languagePoints + canadianExperiencePoints;
        
        // Ensure we don't exceed maximum core points
        this.results.coreHumanCapital = Math.min(points, maxPoints);
    }
    
    calculateLanguagePoints() {
        // Simplified calculation - in a real implementation, would convert test scores to CLB levels
        // and calculate points based on the official IRCC grid
        
        // Get average CLB level (assuming user entered CLB levels)
        const avgCLB = (this.formData.reading + this.formData.writing + 
                        this.formData.listening + this.formData.speaking) / 4;
        
        // Points based on average CLB level
        if (avgCLB >= 9) return 136; // Max for single applicant
        else if (avgCLB >= 8) return 120;
        else if (avgCLB >= 7) return 100;
        else if (avgCLB >= 6) return 60;
        else if (avgCLB >= 5) return 30;
        else return 0;
    }
    
    calculateSpouseFactors() {
        let spousePoints = 0;
        const maxSpousePoints = 40;
        
        // In a real implementation, would need spouse's education, language, and work experience
        // For demonstration, we'll calculate based on some assumptions
        
        // Spouse language (assuming CLB 5+)
        spousePoints += 20;
        
        // Spouse education (assuming at least secondary)
        spousePoints += 10;
        
        // Spouse Canadian experience (assuming none)
        spousePoints += 0;
        
        this.results.spouse = Math.min(spousePoints, maxSpousePoints);
    }
    
    calculateSkillTransferability() {
        let skillPoints = 0;
        const maxSkillPoints = 100;
        
        // Education + Language
        let educationLanguagePoints = 0;
        if (this.formData.education === 'bachelors' || 
            this.formData.education === 'masters' || 
            this.formData.education === 'doctoral') {
            educationLanguagePoints = 50; // Assuming high language (CLB 7+)
        } else if (this.formData.education === 'two-year' || 
                  this.formData.education === 'one-year') {
            educationLanguagePoints = 25; // Assuming high language (CLB 7+)
        }
        
        // Education + Canadian work experience
        let educationCanadianExpPoints = 0;
        if (this.formData.education === 'bachelors' || 
            this.formData.education === 'masters' || 
            this.formData.education === 'doctoral') {
            if (parseInt(this.formData.canadianExperience) >= 1) {
                educationCanadianExpPoints = 50;
            }
        } else if (this.formData.education === 'two-year' || 
                  this.formData.education === 'one-year') {
            if (parseInt(this.formData.canadianExperience) >= 1) {
                educationCanadianExpPoints = 25;
            }
        }
        
        // Foreign work experience + Language
        let foreignExpLanguagePoints = 0;
        if (parseInt(this.formData.foreignExperience) >= 3) {
            foreignExpLanguagePoints = 50; // Assuming high language (CLB 7+)
        } else if (parseInt(this.formData.foreignExperience) >= 1) {
            foreignExpLanguagePoints = 25; // Assuming high language (CLB 7+)
        }
        
        // Foreign work experience + Canadian work experience
        let foreignCanadianExpPoints = 0;
        if (parseInt(this.formData.foreignExperience) >= 3 && 
            parseInt(this.formData.canadianExperience) >= 1) {
            foreignCanadianExpPoints = 50;
        } else if (parseInt(this.formData.foreignExperience) >= 1 && 
                  parseInt(this.formData.canadianExperience) >= 1) {
            foreignCanadianExpPoints = 25;
        }
        
        // Certificate of qualification (for trades)
        let certificationPoints = 0;
        // In a real implementation, would check if applicant has certification
        
        skillPoints = educationLanguagePoints + educationCanadianExpPoints + 
                      foreignExpLanguagePoints + foreignCanadianExpPoints + 
                      certificationPoints;
        
        this.results.skillTransferability = Math.min(skillPoints, maxSkillPoints);
    }
    
    calculateAdditionalPoints() {
        let additionalPoints = 0;
        
        // Provincial nomination (600 points)
        if (this.formData.provincialNomination === 'yes') {
            additionalPoints += 600;
        }
        
        // Job offer (50 or 200 points depending on NOC)
        if (this.formData.jobOffer === 'noc-00') {
            additionalPoints += 200; // NOC TEER 0 (Management)
        } else if (this.formData.jobOffer !== 'no') {
            additionalPoints += 50; // Other eligible NOC categories
        }
        
        // Canadian education
        if (this.formData.canadianEducation === 'three-or-more') {
            additionalPoints += 30;
        } else if (this.formData.canadianEducation === 'one-or-two-year') {
            additionalPoints += 15;
        }
        
        // French language skills
        // In a real implementation, would check French CLB levels
        
        // Sibling in Canada
        if (this.formData.canadianRelatives === 'yes') {
            additionalPoints += 15;
        }
        
        this.results.additional = additionalPoints;
    }
    
    // Method to generate recommendations based on score
    generateRecommendations() {
        const recommendations = [];
        
        if (this.results.total < 470) {
            // Low score recommendations
            if (this.formData.provincialNomination !== 'yes') {
                recommendations.push("Apply for a Provincial Nomination (+600 points) through one of Canada's Provincial Nominee Programs.");
            }
            
            if (this.formData.reading < 9 || this.formData.writing < 9 || 
                this.formData.listening < 9 || this.formData.speaking < 9) {
                recommendations.push("Improve your language test scores - aim for CLB 9+ in all abilities.");
            }
            
            if (parseInt(this.formData.canadianExperience) < 3) {
                recommendations.push("Gain additional Canadian work experience (temporary work permit options).");
            }
            
            if (this.formData.education !== 'masters' && this.formData.education !== 'doctoral') {
                recommendations.push("Pursue higher education to increase your points.");
            }
            
            if (this.formData.canadianEducation === 'no') {
                recommendations.push("Consider studying in Canada to earn Canadian educational credentials (+15-30 points).");
            }
            
            if (this.formData.jobOffer === 'no') {
                recommendations.push("Secure a valid job offer from a Canadian employer (+50-200 points).");
            }
        } else {
            // Higher score recommendations for improvement
            if (this.formData.provincialNomination !== 'yes') {
                recommendations.push("Your score is competitive, but a Provincial Nomination (+600 points) would guarantee an invitation.");
            }
            
            recommendations.push("Maintain your status and ensure all documents are ready for a quick application when invited.");
            recommendations.push("Keep your Express Entry profile updated with any improvements in qualifications.");
        }
        
        return recommendations;
    }
    
    // Method to interpret the score
    interpretScore() {
        if (this.results.total >= 470) {
            return {
                assessment: "Competitive",
                explanation: "Your score is above recent Express Entry cut-offs. You have a good chance of receiving an invitation to apply in upcoming draws.",
                minScores: "Recent Express Entry draws have had cut-offs ranging from 450-480 points."
            };
        } else if (this.results.total >= 400) {
            return {
                assessment: "Moderate",
                explanation: "Your score is approaching competitive levels. You may need to wait for lower CRS cut-offs or consider ways to improve your score.",
                minScores: "Recent Express Entry draws have had cut-offs ranging from 450-480 points."
            };
        } else {
            return {
                assessment: "Below Current Thresholds",
                explanation: "Your score is below current Express Entry cut-offs. Consider following our recommendations to improve your chances, or explore Provincial Nominee Programs.",
                minScores: "Recent Express Entry draws have had cut-offs ranging from 450-480 points."
            };
        }
    }
}