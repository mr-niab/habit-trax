#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Deploying Habit Tracker to Netlify..."
npx -y @netlify/mcp@latest --site-id aa97443f-8cad-4545-9e4a-eb4c0a7507f0 --proxy-path "https://netlify-mcp.netlify.app/proxy/eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..aEgDUl_iJPM5XxGK.addto9yMQU-YHGQd9MrfYPPv7MIPI0TTDH7f3LeNrNkiHHMl2_stWuyvv9pL6yRK2wPBxQ3x9pI8NWhv6IsE69OUpgPkXM-V6aknzFSAy3DRkdvzb2wq5QAriYCeOS_zRizZh7w-i1UtdxcIsIXbIC_ktpz9mM9ux9uPZgiLiiACMWnmVxb-Z9TWTPgQupKR2a1yeTUgoe-bw4G9oPgZW6dUAbZzGEDPkCZzhifHXlgp8orZ9kN44iaEVehxAkXlXIE33h5TjsX9M0SLJOTMR5qF355ND-BDi5VQ2Tk51ZUV2qUP7TFLjrGdY3AV0ei9dn6vjgTuqSKeSFoWJbqUgKG7gBK_1OraRz1oOsO58JedYsWiTdFG1uy8Bm-ESXxCBHO5kaMm.gRnk3LzG_pjMnHh6mFFrwg"
echo ""
echo "✅ Done! Visit https://ollie-habit-tracker.netlify.app"
echo "Press any key to close..."
read -n 1
