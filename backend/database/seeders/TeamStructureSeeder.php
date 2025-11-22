<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TeamStructure;

class TeamStructureSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'user_id' => 1,
                'business_background_id' => 1,
                'operational_plan_id' => 1,
                'team_category' => 'Manajemen',
                'member_name' => 'Rizky Pratama',
                'position' => 'Founder & CEO',
                'experience' => 'Berpengalaman 3 tahun dalam manajemen operasional dan pengembangan bisnis digital.',
                'photo' => null,
                'sort_order' => 1,
                'status' => 'active',
            ],
            [
                'user_id' => 1,
                'business_background_id' => 1,
                'operational_plan_id' => 1,
                'team_category' => 'Operasional',
                'member_name' => 'Andi Setiawan',
                'position' => 'Operational Staff',
                'experience' => '2 tahun pengalaman mengelola operasional harian dan pengelolaan inventaris.',
                'photo' => null,
                'sort_order' => 2,
                'status' => 'active',
            ],
            [
                'user_id' => 1,
                'business_background_id' => 1,
                'operational_plan_id' => 1,
                'team_category' => 'Customer Support',
                'member_name' => 'Rina Oktaviani',
                'position' => 'Customer Support',
                'experience' => 'Pengalaman dalam melayani pelanggan, handling komplain, dan administrasi.',
                'photo' => null,
                'sort_order' => 3,
                'status' => 'active',
            ],
            [
                'user_id' => 1,
                'business_background_id' => 1,
                'operational_plan_id' => 1,
                'team_category' => 'Teknologi',
                'member_name' => 'Bagas Nurrahman',
                'position' => 'IT & System Engineer',
                'experience' => 'Berpengalaman dalam pengembangan sistem berbasis Laravel dan React, maintenance server, serta integrasi API.',
                'photo' => null,
                'sort_order' => 4,
                'status' => 'draft',
            ],
        ];

        foreach ($data as $item) {
            TeamStructure::create($item);
        }
    }
}
