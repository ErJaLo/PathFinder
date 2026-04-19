<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
	public function index(Request $request)
	{
		$messages = ContactMessage::query()
			->where('user_id', $request->user()->id)
			->select('id', 'type', 'subject', 'message', 'status', 'created_at')
			->latest()
			->paginate(10)
			->withQueryString();

		return Inertia::render('contact/contact-us', [
			'messages' => $messages,
		]);
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			'type' => ['required', 'in:suggestion,technical_issue,account,other'],
			'subject' => ['required', 'string', 'max:120'],
			'message' => ['required', 'string', 'max:1000'],
		]);

		ContactMessage::create([
			'user_id' => $request->user()->id,
			'type' => $validated['type'],
			'subject' => $validated['subject'],
			'message' => $validated['message'],
			'status' => 'pending',
		]);

		return back()->with('success', 'Missatge enviat correctament.');
	}
}
