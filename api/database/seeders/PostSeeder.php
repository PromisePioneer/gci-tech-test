<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        for ($i = 0; $i < 30; $i++) {
            Post::create([
                'title' => fake()->title(),
                'content' => fake()->text(),
                'user_id' => User::all()->random()->id,
            ]);
        }
    }
}
