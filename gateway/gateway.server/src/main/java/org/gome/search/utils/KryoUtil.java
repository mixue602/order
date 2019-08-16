package org.gome.search.utils;

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;
import com.esotericsoftware.kryo.serializers.JavaSerializer;
import io.totem.serialization.SerializationPool;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.Serializable;

/**
 * Created by doujintong on 17-4-15.
 */
public class KryoUtil {

    private static SerializationPool pool = new SerializationPool.Builder().maxTotal(100).maxIdle(50).classLoader(Thread.currentThread().getContextClassLoader()).build();

    public static byte[] objectToBytes(Object object) throws Exception {
        return pool.writeClassAndObject(object);
    }

    public static <T> T byteToObject(byte[] bytes) throws Exception {
        return pool.readClassAndObject(bytes);
    }

    public static Object copy(Object obj) {
        return pool.copy(obj);
    }


    public static  <T extends Serializable> byte[] serializationObject(T obj) {
        Kryo kryo = new Kryo();
        kryo.setReferences(false);
        kryo.register(obj.getClass(), new JavaSerializer());

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Output output = new Output(baos);
        kryo.writeClassAndObject(output, obj);
        output.flush();
        output.close();

        byte[] b = baos.toByteArray();
        try {
            baos.flush();
            baos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return b;
    }

    @SuppressWarnings("unchecked")
    public static  <T extends Serializable> T deserializationObject(byte[] obj, Class<T> clazz) {
        Kryo kryo = new Kryo();
        kryo.setReferences(false);
        kryo.register(clazz, new JavaSerializer());
        ByteArrayInputStream bais = new ByteArrayInputStream(obj);
        Input input = new Input(bais);
        return (T) kryo.readClassAndObject(input);
    }
}
