import { ListingData } from '../types';
export const generateEbayHTML = (data: ListingData): string => {

    // Helper to render specs
    const specsHtml = data.specifications
        .map(s => `<li style="box-sizing: border-box;">${s}</li>`)
        .join('');

    // Helper to render package includes
    const packageHtml = data.packageIncludes
        .map(s => `<li>${s}</li>`)
        .join('');

    // Helper to render about item bullets
    const aboutHtml = data.aboutItems
        .map(item => {
            // Split on first colon for bolding if present
            const splitIndex = item.indexOf(':');
            if (splitIndex > -1) {
                const title = item.substring(0, splitIndex + 1);
                const content = item.substring(splitIndex + 1);
                return `<li class="a-spacing-mini" style="box-sizing: border-box; list-style: disc; overflow-wrap: break-word; margin: 0px;"><span class="a-list-item" style="box-sizing: border-box;"><strong>${title}</strong>${content}</span></li>`
            }
            return `<li class="a-spacing-mini" style="box-sizing: border-box; list-style: disc; overflow-wrap: break-word; margin: 0px;"><span class="a-list-item" style="box-sizing: border-box;">${item}</span></li>`;
        })
        .join('');

    // Helper for Main Images
    const mainImagesHtml = data.mainImages
        .map((img, index) => {
            const link = img.link?.trim() !== "" ? img.link : img.url || data.logoUrl;

            return `
    <tr>
        <td align="center" style="padding:0; margin:0; line-height:0;">
            <a href="${link}" target="_blank" style="text-decoration:none;">
                <img 
                    src="${img.url}"
                    alt="${img.alt || `${data.title} - Image ${index + 1}`}" 
                    style="max-width:100%; height:auto; display:block; margin:0; padding:0;"
                />
            </a>
        </td>
    </tr>
    <tr>
        <td style="padding: 0; text-align:center;">
            ${img.title ? `<h3 style="margin:6px 0 4px; font-size:18px; color:#222;">${img.title}</h3>` : ''}
            ${img.details ? `<p style="margin:0 0 8px; color:#555;">${img.details}</p>` : ''}
            ${img.bullets && img.bullets.length ? `<ul style="list-style: disc; margin:8px auto 0; padding-left:20px; text-align:left; max-width:600px;">${img.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
        </td>
    </tr>
    `;
        })
        .join("");

    // Helper for Feature Images (4-up) — optional specific section
    const featureImagesHtml = (data.featureImages && data.featureImages.length)
        ? (() => {
            // Add responsive CSS for feature images sizing
            const featureResponsiveCss = `
   <style>
    .feature-images-container { 
        width: 100%; 
        margin: 20px 0; 
        padding: 0; 
        text-align: center; 
    }

    .feature-images-table { 
        border-collapse: collapse; 
        width: 100%; 
        margin: 0 auto; 
        table-layout: fixed; /* Ensures equal width columns */
    }

    .feature-img-cell { 
        padding: 12px; 
        vertical-align: top; 
    }

    .feature-img-cell img { 
        width: 220px; 
        height: 220px; 
        object-fit: cover; 
        border-radius: 50%; 
        border: 1px solid #eee; 
        display: block; 
        margin: 0 auto 8px; 
        transition: 0.3s ease-in-out;
    }

    /** Large Tablets **/
    @media (max-width: 1200px) {
        .feature-img-cell img { width: 200px; height: 200px; }
    }

    /** Tablets **/
    @media (max-width: 1024px) {
        .feature-img-cell img { width: 170px; height: 170px; }
        .feature-img-cell { padding: 10px !important; }
    }

    /** Small Tablets & Large Phones **/
    @media (max-width: 768px) {
        .feature-img-cell img { width: 140px; height: 140px; }
        .feature-img-cell { padding: 8px !important; }
    }

    /** Mobile Phones **/
    @media (max-width: 600px) {
        .feature-img-cell img { width: 120px; height: 120px; }
    }

    /** Small Mobiles 480px and below **/
    @media (max-width: 480px) {
        .feature-img-cell img { width: 95px; height: 95px; }
        .feature-img-cell { padding: 6px !important; }
        .feature-img-cell p { font-size: 12px !important; }
    }

    /** Extra Small Mobiles 360px **/
    @media (max-width: 360px) {
        .feature-img-cell img { width: 80px; height: 80px; }
        .feature-img-cell p { font-size: 10px !important; }
    }
</style>

            `;
            const perRow = 4;
            const chunks: any[] = [];
            for (let i = 0; i < data.featureImages!.length; i += perRow) {
                chunks.push(data.featureImages!.slice(i, i + perRow));
            }

            // Render all rows into a single table with a fixed minimum width so it lines up
            // with the comparison table below. Each row has exactly 4 cells (empty cells
            // preserve the grid when fewer than 4 images remain in a row).
            return `
                ${featureResponsiveCss}
                <div class="feature-images-container">
                    <table class="feature-images-table" cellspacing="0" cellpadding="0" border="0" align="center">
                        ${chunks.map(row => `
                            <tr>
                                ${[0, 1, 2, 3].map(colIndex => {
                const img = row[colIndex];
                if (!img) {
                    return `<td class="feature-img-cell" style="width:25%; padding:10px; text-align:center; vertical-align:top;"></td>`;
                }
                const fLink = img.link?.trim() !== "" ? img.link : img.url || data.logoUrl;
                return `
                                        <td class="feature-img-cell" style="width:25%; padding:10px; text-align:center; vertical-align:top;">
                                            <a href="${fLink}" target="_blank" style="text-decoration:none; display:block;">
                                                <img src="${img.url}" alt="${img.alt || data.title}" />
                                            </a>
                                            ${img.title ? `<div style="font-weight:bold; color:#222; margin-bottom:6px;">${img.title}</div>` : ''}
                                            ${img.details ? `<div style="color:#555; font-size:14px;">${img.details}</div>` : ''}
                                        </td>
                                    `;
            }).join('')}
                            </tr>
                        `).join('')}
                    </table>
                </div>
            `;
        })()
        : '';



    // Helper for Comparison Table Headers (Images & Titles)
    // Compute dynamic widths: make the left label column narrower so the corner
    // is shorter, and distribute the remaining width evenly across comparison columns.
    const compCount = data.comparisonItems.length || 1;
    const labelColWidth = 5; // percent used by the left label/empty corner (adjustable)
    const compColWidth = (100 - labelColWidth) / compCount; // percent per comparison column

    const comparisonHeaderHtml = data.comparisonItems.map(item => `
        <td class="comparison-header-cell" style="width: ${compColWidth}%">
                <a href="${item.link}" target="_blank" style="text-decoration:none;">
                        <img src="${item.image}" alt="${item.imageAlt || item.title}">
                        <p>${item.title}</p>
                        <button>Click here</button>
                </a>
        </td>
    `).join('');

    // Comparison Rows - use dynamic rows from data.comparisonRows, or fall back to defaults
    const defaultRows = [
        { label: 'Price', key: 'price' },
        { label: 'Material', key: 'material' },
        { label: 'Light Source', key: 'lightSource' },
        { label: 'Base', key: 'base' },
    ];
    
    const rowsToUse = data.comparisonRows && data.comparisonRows.length > 0 
        ? data.comparisonRows 
        : defaultRows;

    const createRow = (label: string, key: string) => `
          <tr style="border-bottom: 1px solid #eee;">
              <td class="comparison-row-label" style="width: ${labelColWidth}%;">${label}</td>
              ${data.comparisonItems.map(item => `<td class="comparison-row-cell" style="width: ${compColWidth}%;">${item[key] || ''}</td>`).join('')}
          </tr>
        `;

    const comparisonRows = rowsToUse.map(row => createRow(row.label, row.key)).join('');

    return `
<!-- Generated by eBay Template Builder -->
<div style="font-family: 'Verdana', sans-serif; color: #333; max-width:100%; margin: 0 auto; padding: 0; margin-bottom: 0;">
    <h2 style="padding: 0; margin: 0; text-align: center; max-width: 100%;">
        <span style="display: inline-block; padding: 10px 20px; text-align: center; background-color: transparent;">
        <font color="#212529" face="Verdana" size="6.8">${data.title}</font>
            
        </span>
    </h2>

    <table width="100%" cellspacing="0" margin-top:0; cellpadding="0" border="0" align="center" style="margin:10px 0; padding:0;">
        <tbody>
            ${mainImagesHtml}
            ${featureImagesHtml}
        </tbody>
    </table>

    <style>
        .comparison-description {
            width: 100%;
            max-width: 100%;
            margin: 20px 0;
            padding: 20px 0;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.02);
        }
        
        .comparison-description p {
            margin: 0;
            padding: 0;
            font-size: 24px;
            font-weight: bold;
            color: #000000;
            line-height: 1.4;
            font-family: 'Verdana', sans-serif;
            text-align: center;
        }
        
        .comparison-brand-bar {
            width: 95%;
            
            background-color: #000000;
            padding: 10px 0;
            margin: 0px auto;
            text-align: center;
            
        }
        
        .comparison-brand-bar p {
            margin: 0;
            padding: 0;
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-family: 'Verdana', sans-serif;
        }
        
        /* Responsive styles for tablets */
        @media (max-width: 1024px) {
            .comparison-description {
                padding: 15px 0;
            }
            
            .comparison-description p {
                font-size: 20px;
            }
            
            .comparison-brand-bar {
                padding: 12px 0;
            }
            
            .comparison-brand-bar p {
                font-size: 18px;
                letter-spacing: 1.5px;
            }
        }
        
        /* Responsive styles for mobile phones */
        @media (max-width: 768px) {
            .comparison-description {
                padding: 12px 0;
                margin: 15px 0;
            }
            
            .comparison-description p {
                font-size: 18px;
                line-height: 1.3;
            }
            
            .comparison-brand-bar {
                padding: 10px 0;
            }
            
            .comparison-brand-bar p {
                font-size: 16px;
                letter-spacing: 1px;
            }
        }
        
        /* Responsive styles for small mobiles */
        @media (max-width: 480px) {
            .comparison-description {
                padding: 10px 0;
                margin: 10px 0;
            }
            
            .comparison-description p {
                font-size: 16px;
                line-height: 1.2;
            }
            
            .comparison-brand-bar {
                padding: 8px 0;
            }
            
            .comparison-brand-bar p {
                font-size: 14px;
                letter-spacing: 0.5px;
            }
        }
    </style>
    
    ${data.comparisonDescription ? `
    <div class="comparison-description width:60%; margin:0 auto; text-align:center;">
        <p>${data.comparisonDescription}</p>
    </div>
    ` : ''}
    
    ${data.comparisonBrandBar ? `
    <div class="comparison-brand-bar">
        <p>${data.comparisonBrandBar}</p>
    </div>
    ` : ''}

    <h2 style="font-size:24px; font-weight:bold; margin:20px 0 20px 0; text-align:center; padding:0;">
        Compare with similar items
    </h2>

    <!-- Comparison Table -->
    <style>
        .comparison-table-wrapper {
            width: 100%;
            margin: 0 auto;
            padding: 0;
            text-align: center;
            overflow-x: auto;
            font-family: 'Verdana', sans-serif;
            -webkit-overflow-scrolling: touch;
        }
        
        .comparison-table {
            border-collapse: collapse;
            font-family: 'Verdana', sans-serif;
            font-size: 14px;
            text-align: center;
            width: 100%;
            margin: 0 auto;
            padding: 0;
            min-width: 600px;
        }
        
        .comparison-table td {
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .comparison-header-cell {
            padding: 20px 10px;
            vertical-align: top;
        }
        
        .comparison-header-cell img {
            width: 100%;
            max-width: 180px;
            height: 180px;
            object-fit: contain;
            border-radius: 6px;
            border: 1px solid #eee;
        }
        
        .comparison-header-cell p {
            margin: 0 auto;
            padding: 10px 0;
            font-size: 14px;
            color: #000000;
            text-align: center;
            line-height: 1.2;
            height: 50px;
            overflow: hidden;
        }
        
        .comparison-header-cell button {
            background: #008bfd;
            border: none;
            padding: 8px 12px;
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
            width: 100%;
        }
        
        .comparison-row-label {
            padding: 10px;
            font-weight: bold;
            text-align: left;
            background: #f9f9f9;
        }
        
        .comparison-row-cell {
            padding: 10px;
        }
        
        /* Responsive styles for tablets */
        @media (max-width: 1024px) {
            .comparison-table {
                min-width: 500px;
                font-size: 13px;
            }
            
            .comparison-header-cell {
                padding: 15px 8px;
            }
            
            .comparison-header-cell img {
                max-width: 150px;
                height: 150px;
            }
            
            .comparison-header-cell p {
                font-size: 13px;
                height: 45px;
            }
            
            .comparison-header-cell button {
                padding: 6px 10px;
                font-size: 11px;
            }
            
            .comparison-row-label,
            .comparison-row-cell {
                padding: 8px;
                font-size: 13px;
            }
        }
        
        /* Responsive styles for small tablets and large phones */
        @media (max-width: 768px) {
            .comparison-table {
                min-width: 450px;
                font-size: 12px;
            }
            
            .comparison-header-cell {
                padding: 12px 6px;
            }
            
            .comparison-header-cell img {
                max-width: 120px;
                height: 120px;
            }
            
            .comparison-header-cell p {
                font-size: 12px;
                height: 40px;
                padding: 8px 0;
            }
            
            .comparison-header-cell button {
                padding: 6px 8px;
                font-size: 10px;
            }
            
            .comparison-row-label,
            .comparison-row-cell {
                padding: 6px;
                font-size: 12px;
            }
        }
        
        /* Responsive styles for mobile phones */
        @media (max-width: 600px) {
            .comparison-table {
                min-width: 400px;
                font-size: 11px;
            }
            
            .comparison-header-cell {
                padding: 10px 5px;
            }
            
            .comparison-header-cell img {
                max-width: 100px;
                height: 100px;
            }
            
            .comparison-header-cell p {
                font-size: 11px;
                height: 35px;
                padding: 6px 0;
            }
            
            .comparison-header-cell button {
                padding: 5px 6px;
                font-size: 9px;
            }
            
            .comparison-row-label,
            .comparison-row-cell {
                padding: 5px;
                font-size: 11px;
            }
        }
        
        /* Responsive styles for small mobiles */
        @media (max-width: 480px) {
            .comparison-table {
                min-width: 350px;
                font-size: 10px;
            }
            
            .comparison-header-cell {
                padding: 8px 4px;
            }
            
            .comparison-header-cell img {
                max-width: 80px;
                height: 80px;
            }
            
            .comparison-header-cell p {
                font-size: 10px;
                height: 30px;
                padding: 5px 0;
            }
            
            .comparison-header-cell button {
                padding: 4px 5px;
                font-size: 8px;
            }
            
            .comparison-row-label,
            .comparison-row-cell {
                padding: 4px;
                font-size: 10px;
            }
        }
        
        /* Responsive styles for extra small mobiles */
        @media (max-width: 360px) {
            .comparison-table {
                min-width: 300px;
                font-size: 9px;
            }
            
            .comparison-header-cell img {
                max-width: 70px;
                height: 70px;
            }
            
            .comparison-header-cell p {
                font-size: 9px;
                height: 25px;
            }
            
            .comparison-header-cell button {
                padding: 3px 4px;
                font-size: 7px;
            }
            
            .comparison-row-label,
            .comparison-row-cell {
                padding: 3px;
                font-size: 9px;
            }
        }
    </style>
    <div class="comparison-table-wrapper">
        <table class="comparison-table" cellspacing="0" cellpadding="0" border="0">
            ${(() => {
            // Build a colgroup so columns have fixed widths (label + N comparison cols).
            // Use the same labelColWidth as above so the corner is shorter.
            const compCount = data.comparisonItems.length || 1;
            const labelColWidth = 5; // must match the label width used above
            const compColWidth = (100 - labelColWidth) / compCount;
            let cols = `<col style="width:${labelColWidth}%;" />`;
            for (let i = 0; i < compCount; i++) cols += `<col style="width:${compColWidth}%;" />`;
            return `<colgroup>${cols}</colgroup>`;
        })()}
            <tbody>
                <tr>
                    <td style="padding:0; margin:0; width: 5%;"></td>
                    ${comparisonHeaderHtml}
                </tr>
                ${comparisonRows}
            </tbody>
        </table>
    </div>

    <div style="max-width: 90%; margin: 0 auto; margin-top:40px;font-family: 'Verdana', sans-serif; padding:0;">
        
        <!-- PRODUCT INFORMATION -->
        <details open style="margin-bottom:20px; padding:15px; border: 1px solid #dddddd; border-radius: 5px;">
            <summary style="font-size:18px; font-weight:bold; color:#222; cursor:pointer; padding-bottom:5px;">PRODUCT INFORMATION</summary>
            <p style="margin-top:20px;"><strong style="font-size:16px; color:#222;">DESCRIPTION</strong></p>
            <ul>
                <li>${data.description}</li>
            </ul>

            <p style="margin-top:10px;"><strong style="font-size:16px; color:#222;">SPECIFICATIONS:</strong></p>
            <ul style="list-style-type: disc; padding-left: 20px;">
                ${specsHtml}
            </ul>

            <p style="margin-top: 10px;"><strong><font size="4">Package included:</font></strong></p>
            <ul style="list-style-type: disc; padding-left: 20px;">
               ${packageHtml}
            </ul>
        </details>

        <!-- ABOUT THIS ITEM -->
        <details style="margin-bottom:20px; padding:15px; border: 1px solid #dddddd; border-radius: 5px;">
            <summary style="font-size:18px; font-weight:bold; color:#222; cursor:pointer; padding-bottom:5px;">ABOUT THIS ITEM</summary>
            <ul class="a-unordered-list a-vertical a-spacing-mini" style="margin: 10px 0 0 18px; color: #0f1111; padding: 0px;">
                ${aboutHtml}
            </ul>
        </details>

        <!-- TERMS & CONDITIONS -->
        <details style="margin-bottom:20px; padding:15px; border: 1px solid #dddddd; border-radius: 5px;">
            <summary style="font-size:18px; font-weight:bold; color:#222; cursor:pointer;">TERMS & CONDITIONS</summary>
            <h3 style="color:#222; margin-top:10px;">POSTAGE</h3>
            <ul style="list-style-type: disc; padding-left:20px; color:#555;">
                <li><font color="#555555">Order will be dispatched within 1 working day (Mon-Fri) via Royal Mail 48hrs / 2nd class. Delivery normally takes&nbsp;</font><strong><font color="#873d92">3-5 working days</font></strong><font color="#555555">&nbsp;for standard service.</font></li>
                <li>We will only send replacement items once Royal Mail confirms the item is lost.</li>
                <li>As Per eBay Guidelines, We Are Unable to Change Your Shipping Address Once We Received Your Payment.</li>
            </ul>

            <h3 style="color:#222; margin-top:10px;">RETURNS & REFUNDS</h3>
            <ul style="list-style-type: disc; padding-left:20px; color:#555;">
                <li><font color="#555555">We have a</font><strong><font color="#9e2048">&nbsp;60 days</font></strong><font color="#555555">&nbsp;no-quibble return policy.</font></li>
                <li>Buyer pays for the return postage.</li>
            </ul>
            
            <h3 style="font-family: Arial, sans-serif; margin-top: 20px;">CONTACT</h3>
            <ul style="font-family: Arial, sans-serif; color: rgb(51, 51, 51); line-height: 1.6; padding-left: 20px;">
                <li>If you have any questions or concerns, please send a message to the eBay messaging system; we will get back within 24hrs.</li>
                <li>Working Days: Monday - Friday</li>
                <li>Working Hours: 8:00 AM - 4:00 PM</li>
            </ul>
        </details>

        <!-- SHIPPING DETAILS -->
        <details style="margin-bottom:20px; padding:15px; border: 1px solid #dddddd; border-radius: 5px;">
            <summary style="font-size:18px; font-weight:bold; color:#222; cursor:pointer;">SHIPPING DETAILS</summary>
            <ul style="list-style-type: disc; padding-left:20px; color:#555;">
                <li><strong>FREE SHIPPING:</strong>&nbsp;${data.shippingInfo.freeShipping}</li>
                <li><strong>FIRST CLASS:</strong>&nbsp;${data.shippingInfo.firstClass}</li>
                <li><strong>INTERNATIONAL ORDERS:</strong>&nbsp;${data.shippingInfo.international}</li>
            </ul>
        </details>

        <!-- ABOUT US -->
        <details style="padding:15px; border: 1px solid #dddddd; border-radius: 5px; margin: 0;">
            <summary style="font-size:18px; font-weight:bold; color:#222; cursor:pointer;">ABOUT US</summary>
            <a href="${data.ebayStoreUrl}" target="_blank" style="text-decoration:none;">
                <img src="${data.logoUrl}" alt="${data.logoAlt || `${data.title} - eBay Store Logo`}" style="margin: 10px; padding-top: 20px; max-width:180px; object-fit:contain;">
            </a>
            <p style="color:#555; margin-top:10px;">${data.aboutUs}</p>
        </details>
    </div>
</div>
  `;
};
