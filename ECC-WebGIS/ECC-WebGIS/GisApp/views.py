from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import pg8000

# Create your views here.
# @login_required
def dashboard(request):

    return render(request, 'GisApp/gis_dashboard.html')

# def createSpatialFeature(request):
#     conn = pg8000.connect(database="ECCdb", user="postgres",password="postgres")
#     cursor = conn.cursor()
#     if request.method == 'POST':
#         gid = request.POST['gid']
#         objectid = request.POST['object_id']
#         x = request.POST['long']
#         y = request.POST['lat']
#         name = request.POST['name']
#         type = request.POST['type']
#         cursor.execute("INSERT INTO ecc_east_africa VALUES (%s, %s, %s, %s, %s, %s)", (gid, objectid, x, y, name, type,))
#         conn.commit()
#     cursor.execute("Select ST_SetSRID(ST_MakePoint(x,y), 4326), gid from ecc_east_africa")
#     results = cursor.fetchall()
#     plusCodeList=[]  
#     for pc in results:
#         geom, gid=pc
#         pcl={}
#         pcl['geom'] = geom
#         pcl['gid'] = gid
#         plusCodeList.append(pcl)
#         plusql="""UPDATE ecc_east_africa SET geom= %s WHERE gid=%s"""
#         cursor.execute(plusql, (geom, gid))
#         conn.commit()

#     return render(request, 'GisApp/create_custom_station.html')
def createSpatialFeature(request):
    conn = pg8000.connect(database="ECCdb", user="postgres",password="postgres",host="localhost",port=5430)
    cursor = conn.cursor()
    if request.method == 'POST':
        gid = request.POST['gid']
        objectid = request.POST['object_id']
        x = request.POST['long']
        y = request.POST['lat']
        name = request.POST['name']
        type = request.POST['type']
        cursor.execute("INSERT INTO ecc_east_africa VALUES (%s, %s, %s, %s, %s, %s)", (gid, objectid, x, y, name, type,))
        conn.commit()
        cursor.execute("Select ST_SetSRID(ST_MakePoint(x,y), 4326), gid from ecc_east_africa WHERE gid='%s'" % gid)
        results = cursor.fetchone()
        geom=results[0]
        gid=results[1]
        plusql="""UPDATE ecc_east_africa SET geom= %s WHERE gid=%s"""
        cursor.execute(plusql, (geom, gid))
        conn.commit()
    return render(request, 'GisApp/create_custom_station.html')

def modal(request):
    return render(request,'GisApp/modal.html')

def navbar(request):
    return render(request,'GisApp/navbar.html')