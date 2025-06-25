<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - {{ $userProfile->first_name ?? '' }} {{ $userProfile->last_name ?? '' }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        
        .cv-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
        }
        
        /* Template Modern */
        .template-modern .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .template-modern .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 300;
        }
        
        .template-modern .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        
        .template-modern .contact-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
        .template-modern .contact-info span {
            font-size: 14px;
        }
        
        /* Template Classic */
        .template-classic .header {
            border-bottom: 3px solid #2c3e50;
            padding: 30px 0;
            text-align: center;
        }
        
        .template-classic .header h1 {
            margin: 0;
            font-size: 28px;
            color: #2c3e50;
        }
        
        .template-classic .contact-info {
            margin-top: 15px;
            text-align: center;
        }
        
        .template-classic .contact-info span {
            margin: 0 15px;
            font-size: 14px;
        }
        
        /* Template Creative */
        .template-creative .header {
            background: #f8f9fa;
            padding: 40px 30px;
            border-left: 5px solid #e74c3c;
        }
        
        .template-creative .header h1 {
            margin: 0;
            font-size: 30px;
            color: #2c3e50;
            font-weight: bold;
        }
        
        .template-creative .contact-info {
            margin-top: 15px;
        }
        
        .template-creative .contact-info span {
            display: block;
            margin: 5px 0;
            font-size: 14px;
        }
        
        /* Sections communes */
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            font-size: 20px;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        
        .section h3 {
            font-size: 16px;
            color: #34495e;
            margin-bottom: 10px;
        }
        
        .section p {
            margin-bottom: 10px;
            text-align: justify;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .skill-tag {
            background: #ecf0f1;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 12px;
            color: #2c3e50;
        }
        
        .experience-item, .education-item {
            margin-bottom: 20px;
            padding-left: 20px;
            border-left: 3px solid #3498db;
        }
        
        .experience-item h4, .education-item h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #2c3e50;
        }
        
        .experience-item .company, .education-item .institution {
            font-weight: bold;
            color: #7f8c8d;
            font-size: 14px;
        }
        
        .experience-item .period, .education-item .period {
            font-style: italic;
            color: #95a5a6;
            font-size: 12px;
        }
        
        @media print {
            body {
                padding: 0;
            }
            .cv-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="cv-container template-{{ $template }}">
        <div class="header">
            <h1>{{ $userProfile->first_name ?? '' }} {{ $userProfile->last_name ?? '' }}</h1>
            <div class="contact-info">
                @if($userProfile->email)
                    <span>📧 {{ $userProfile->email }}</span>
                @endif
                @if($userProfile->phone)
                    <span>📞 {{ $userProfile->phone }}</span>
                @endif
                @if($userProfile->address)
                    <span>📍 {{ $userProfile->address }}</span>
                @endif
            </div>
        </div>
        
        <div class="content">
            {!! $content !!}
        </div>
    </div>
</body>
</html>

