<?php

namespace App\Repositories;

use App\Recommendation;

class RecommendationRepository 
{

    protected $recommendation;

    public function __construct(Recommendation $recommendation)
	{
		$this->recommendation = $recommendation;
	}

	private function save(Recommendation $recommendation, Array $inputs)
	{
        
	}
    
} 