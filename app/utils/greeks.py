import numpy as np
from scipy.stats import norm
from datetime import datetime

class GreeksCalculator:
    """Calculate option Greeks for risk management"""
    
    @staticmethod
    def black_scholes_call(S, K, T, r, sigma):
        """Calculate Call option price using Black-Scholes"""
        d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
        d2 = d1 - sigma*np.sqrt(T)
        
        call_price = S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)
        return call_price
    
    @staticmethod
    def black_scholes_put(S, K, T, r, sigma):
        """Calculate Put option price using Black-Scholes"""
        d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
        d2 = d1 - sigma*np.sqrt(T)
        
        put_price = K*np.exp(-r*T)*norm.cdf(-d2) - S*norm.cdf(-d1)
        return put_price
    
    @staticmethod
    def calculate_delta(S, K, T, r, sigma, option_type='call'):
        """Calculate Delta - rate of change of option price w.r.t. spot"""
        d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
        
        if option_type.lower() == 'call':
            return norm.cdf(d1)
        else:
            return norm.cdf(d1) - 1
    
    @staticmethod
    def calculate_theta(S, K, T, r, sigma, option_type='call'):
        """Calculate Theta - time decay"""
        d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
        d2 = d1 - sigma*np.sqrt(T)
        
        theta_call = (-S*norm.pdf(d1)*sigma/(2*np.sqrt(T)) - 
                     r*K*np.exp(-r*T)*norm.cdf(d2))
        
        if option_type.lower() == 'call':
            return theta_call / 365  # Daily theta
        else:
            theta_put = theta_call + r*K*np.exp(-r*T)
            return theta_put / 365
    
    @staticmethod
    def calculate_all_greeks(S, K, T, r, sigma, option_type='put'):
        """Calculate all Greeks for a position"""
        calc = GreeksCalculator()
        
        return {
            'delta': calc.calculate_delta(S, K, T, r, sigma, option_type),
            'theta': calc.calculate_theta(S, K, T, r, sigma, option_type),
            'days_to_expiry': int(T * 365)
        }