<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class NotificationCreateRequest extends Request
{

    public function authorize()
	{
		return true;
	}

	public function rules()
	{
		return [
			'user_id' => 'required|numeric',
			'sender_id' => 'required|numeric',
			'track_id' => 'required|numeric',
			'user_id' => 'required|numeric',
			'seen' => '0',
		];
	}

}